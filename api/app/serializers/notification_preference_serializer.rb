class NotificationPreferenceSerializer < ApplicationSerializer
  meta(partial: false)

  attributes :kind, :frequency, :valid_frequencies
end
