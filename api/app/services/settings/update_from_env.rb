class Settings < ApplicationRecord
  # After reading settings from `ENV`, merge them into
  # their respective attributes on {Settings}.
  #
  # @see [Settings::ReadFromEnv]
  class UpdateFromEnv < ActiveInteraction::Base
    object :settings, default: proc { Settings.instance }

    # @return [void]
    def execute
      env_settings = compose Settings::ReadFromEnv

      env_settings.each do |(section, section_settings)|
        settings.merge_settings_into! section, section_settings
      end

      unless settings.save
        errors.add :base, settings.errors.full_messages.to_sentence

        return false
      end

      nil
    end
  end
end
