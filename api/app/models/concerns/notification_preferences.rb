module NotificationPreferences
  extend ActiveSupport::Concern

  included do
    has_many :notification_preferences, dependent: :destroy, autosave: true, inverse_of: model_name.i18n_key

    # Returns users that have opted into a digest for a given frequency
    # rubocop:disable Layout/LineLength
    scope :with_digest_for_frequency, ->(frequency) { where(id: NotificationPreference.for_user(:digest, frequency)) }

    # Returns users that have notification preferences matching
    # the given kind and frequency.
    scope :with_notification_for_frequency, ->(kind, frequency) { where(id: NotificationPreference.for_user(kind, frequency)) if kind.present? && frequency.present? }
    # rubocop:enable Layout/LineLength
  end

  # @!attribute [rw] notification_preferences_by_kind
  # @return [{ Symbol => NotificationFrequency }]
  def notification_preferences_by_kind
    notification_preferences.each_with_object({}.with_indifferent_access) do |preference, base|
      base[preference.kind.to_sym] = preference.frequency
    end
  end

  def notification_preferences_by_kind=(new_preferences)
    new_preferences.each do |kind, frequency|
      preference = notification_preferences.detect { |np| np.kind == kind } || notification_preferences.build(kind: kind)

      next unless preference.present?

      preference.frequency = frequency
    end
  end

  def wants_notifications_for?(kind)
    notification_preferences.by_tuple(kind, :always).exists?
  end

  def unsubscribe_all
    notification_preferences.update(frequency: :never)

    update notification_preferences_by_kind: {
      followed_projects: :always
    }
  end

  private

  # @param [Role] role
  # @return [void]
  def sync_notification_preferences!(role)
    return unless role.global?

    visible_kinds = NotificationKind.visible_to kind

    visible_kinds.each do |kind|
      preference = notification_preferences.by_kind(kind)

      if persisted?
        preference.first_or_create
      else
        preference.first_or_initialize
      end
    end

    notification_preferences.each do |pref|
      pref.destroy unless pref.kind.in? visible_kinds
    end
  end
end
