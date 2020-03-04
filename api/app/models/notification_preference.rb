class NotificationPreference < ApplicationRecord
  belongs_to :user, inverse_of: :notification_preferences

  classy_enum_attr :kind, class_name: "NotificationKind", allow_blank: false
  classy_enum_attr :frequency, class_name: "NotificationFrequency", allow_blank: false

  scope :by_kind, ->(kind) { where(kind: kind) }
  scope :by_frequency, ->(frequency) { where(frequency: frequency) }
  scope :for_user, ->(kind, frequency) { by_tuple(kind, frequency).select(:user_id) }

  validate :frequency_is_valid!

  before_create :default_followed_projects_to_always!

  private

  def frequency_is_valid!
    errors.add(:frequency, "is invalid for #{kind}") unless kind.allow_frequency?(frequency)
  end

  def default_followed_projects_to_always!
    return unless kind.followed_projects?

    self.frequency = :always
  end

  class << self
    # @param [NotificationKind, Symbol, String] kind
    # @param [NotificationFrequency, Symbol, String] frequency
    # @return [ActiveRecord::Relation<NotificationPreference>]
    def by_tuple(kind, frequency)
      kind = NotificationKind[kind]

      frequency = NotificationFrequency[frequency]

      return none if kind.blank? || frequency.blank?

      return none unless kind.allow_frequency?(frequency)

      by_kind(kind).by_frequency(frequency)
    end
  end
end
