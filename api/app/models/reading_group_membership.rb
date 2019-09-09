require "faker"
# A reading group is a cohort of users who are collaboratively consuming Manifold content.
class ReadingGroupMembership < ApplicationRecord

  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include Filterable

  validates :user_id, uniqueness: { scope: :reading_group_id }

  belongs_to :user, optional: false
  belongs_to :reading_group, optional: false, counter_cache: :memberships_count

  # rubocop:disable Rails/HasManyOrHasOneDependent
  has_one :reading_group_membership_count
  # rubocop:enable Rails/HasManyOrHasOneDependent

  delegate :annotations_count, to: :reading_group_membership_count, allow_nil: true
  delegate :highlights_count, to: :reading_group_membership_count, allow_nil: true

  before_validation :ensure_anonymous_label
  after_commit :enqueue_notification, on: [:create]

  class << self

    def visible_reading_group_ids_for(user)
      return none if user.blank?

      joins(:reading_group).where(user: user)
        .or(joins(:reading_group)
          .merge(ReadingGroup.visible_to_public))
        .select(:reading_group_id)
    end
  end

  def creator?
    reading_group.creator_id == user_id
  end

  private

  def enqueue_notification
    return unless reading_group.notify_on_join
    return if reading_group.creator_id == user.id

    Notifications::SendReadingGroupJoinNotificationJob.perform_later(reading_group.creator_id, id)
  end

  def ensure_anonymous_label
    return if anonymous_label.present?

    self.anonymous_label = generate_anonymous_label
  end

  def generate_anonymous_label
    base_label = "Anonymous #{::Faker::Creature::Animal.name.titleize}"
    label = base_label
    i = 1
    while ReadingGroupMembership.exists?(anonymous_label: label, reading_group_id: reading_group_id)
      i += 1
      label = "#{base_label} ##{i}"
    end
    label
  end

end
