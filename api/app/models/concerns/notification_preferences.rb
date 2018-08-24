module Concerns
  module NotificationPreferences
    extend ActiveSupport::Concern

    included do
      has_many :notification_preferences, dependent: :destroy, autosave: true

      # Returns users that have opted into a digest for a given frequency
      # rubocop:disable Metrics/LineLength
      scope :with_digest_for_frequency, lambda { |frequency|
        next none unless frequency.digest?
        where(id: unscoped.joins(:notification_preferences)
                          .where(notification_preferences: { kind: NotificationKind[:digest],
                                                             frequency: frequency }))
      }
      # rubocop:enable Metrics/LineLength

      # Returns users that have notification preferences matching
      # the given kind and frequency.
      scope :with_notification_for_frequency, lambda { |kind, frequency|
        next all unless kind.present? && frequency.present?
        where(id: unscoped.joins(:notification_preferences)
                          .where(notification_preferences: { kind: kind,
                                                             frequency: frequency }))
      }
    end

    def notification_preferences_by_kind
      base = {}.with_indifferent_access
      notification_preferences.each_with_object(base) do |preference, h|
        h[preference.kind.to_sym] = preference.frequency
      end
    end

    def notification_preferences_by_kind=(new_preferences)
      new_preferences.each do |kind, frequency|
        preference = notification_preferences.detect { |np| np.kind == kind }
        next unless preference.present?

        preference.frequency = frequency
      end
    end

    def wants_notifications_for?(kind)
      notification_preferences.by_kind(kind)
                              .where(frequency: NotificationFrequency[:always]).present?
    end

    def unsubscribe_all
      notification_preferences.update(frequency: NotificationFrequency[:never])
      update notification_preferences_by_kind: {
        followed_projects: NotificationFrequency[:always]
      }
    end

    private

    # rubocop:disable Metrics/AbcSize
    def sync_notification_preferences!(_role = nil)
      visible_kinds = NotificationKind.visible_to kind

      visible_kinds.each do |kind|
        if persisted?
          notification_preferences.by_kind(kind).first_or_create
        else
          notification_preferences.by_kind(kind).first_or_initialize
        end
      end

      notification_preferences.each do |pref|
        pref.mark_for_destruction unless pref.kind.in? visible_kinds
      end
    end
    # rubocop:enable Metrics/AbcSize
  end
end
