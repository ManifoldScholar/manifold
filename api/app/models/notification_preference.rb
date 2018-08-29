class NotificationPreference < ApplicationRecord
  # Associations
  belongs_to :user

  # ClassyEnum
  include ClassyEnum::ActiveRecord
  classy_enum_attr :kind, class_name: "NotificationKind"
  classy_enum_attr :frequency, class_name: "NotificationFrequency"

  # Scopes
  scope :by_kind, ->(kind) { where(kind: kind) }
  scope :by_frequency, ->(frequency) { where(frequency: frequency) }

  # Validations
  validates :kind, :frequency, presence: true
  validate :frequency_is_valid!

  # Callbacks
  before_create :default_followed_projects_to_always!

  private

  def frequency_is_valid!
    valid = kind.digest? ? frequency.digest? : frequency.nondigest?
    return true if valid
    errors.add(:frequency, "is invalid for #{kind}")
  end

  def default_followed_projects_to_always!
    return unless kind.followed_projects?
    assign_attributes(frequency: NotificationFrequency[:always])
  end

end
