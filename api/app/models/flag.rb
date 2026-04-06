# frozen_string_literal: true

# A flag that marks a {FlaggableResource} for review.
class Flag < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor

  include TrackedCreator

  strip_attributes only: %i[message]

  scope :by_creator, ->(creator) { where(creator: creator) if creator.present? }
  scope :by_flaggable, ->(flaggable) { where(flaggable: flaggable) if flaggable.present? }
  scope :sans_resolved, -> { with_resolved.where(resolved_at: nil) }
  scope :only_resolved, -> { with_resolved.where.not(resolved_at: nil) }
  scope :with_resolved, -> { unscope(where: :resolved_at) }

  belongs_to :flaggable, polymorphic: true, touch: true

  validates :creator_id, uniqueness: { scope: %i[flaggable_type flaggable_id] }

  after_commit :enqueue_flag_notifications!, on: :create

  # @param [User, nil] resolver
  # @return [void]
  def resolve!(resolver: nil)
    self.resolved_at ||= Time.current

    if creator == resolver
      self.resolved_by_creator = true
    end

    save!
  end

  # @!attribute [r] resolved
  # Boolean state of {#resolved_at}
  # @return [Boolean]
  def resolved
    resolved_at?
  end

  alias resolved? resolved

  private

  def enqueue_flag_notifications!
    Notifications::EnqueueFlagNotificationsJob.perform_later id
  end
end
