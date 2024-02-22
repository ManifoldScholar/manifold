# frozen_string_literal: true

module SettingsService
  # After reading settings from `ENV`, merge them into
  # their respective attributes on {Settings}.
  #
  # @see Settings::ReadFromEnv
  class UpdateFromEnv < ActiveInteraction::Base
    record :settings, default: proc { Settings.instance }

    # @return [void]
    def execute
      env_settings = compose SettingsService::ReadFromEnv

      env_settings.each do |(section, section_settings)|
        settings.merge_settings_into! section, section_settings
      end

      return if settings.save

      # :nocov:
      errors.add :base, settings.errors.full_messages.to_sentence

      return false
      # :nocov:
    end
  end
end
