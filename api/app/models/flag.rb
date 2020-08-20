# A flag that flags a flaggable for review.
class Flag < ApplicationRecord

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor

  # Concerns
  include TrackedCreator

  # Scopes
  scope :by_creator, lambda { |creator|
    next all unless creator.present?

    where(creator: creator)
  }
  scope :by_flaggable, lambda { |flaggable|
    next all unless flaggable.present?

    where(flaggable: flaggable)
  }

  # Associations
  belongs_to :flaggable, polymorphic: true, counter_cache: :flags_count

  # # Validations
  # validates :flaggable, presence: true

  # Callbacks
  after_commit :enqueue_flag_notifications, on: [:create]

  private

  def enqueue_flag_notifications
    Notifications::EnqueueFlagNotificationsJob.perform_later id
  end

end
