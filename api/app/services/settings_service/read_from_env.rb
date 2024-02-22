# frozen_string_literal: true

module SettingsService
  # Read settings from `ENV` and transform into a suitable hash
  # that can be merged into {Settings}.
  class ReadFromEnv < ActiveInteraction::Base
    # Parses an environment variable into its component section & setting names
    KEY_PARSER = /\AMANIFOLD_SETTING_(?<section>[^_]+)_(?<setting>\w+)\z/.freeze

    # Proxied here so that we can test easily.
    interface :env, methods: %i(each_with_object), default: proc { ENV }

    # @return [{Symbol => {Symbol => String}}]
    def execute
      env.each_with_object({}) do |(key, value), hsh|
        next unless key =~ KEY_PARSER

        section = Regexp.last_match[:section].downcase.to_sym
        setting = Regexp.last_match[:setting].downcase.to_sym

        value = parse_value(section, setting, value)

        next if value.nil?

        next hsh.deep_merge! value if section == :config

        hsh[section] ||= {}
        hsh[section][setting] = value
      end
    end

    private

    # @param [Symbol] section
    # @param [Symbol] setting
    # @param [String] value
    # @return [String]
    def parse_value(section, setting, value)
      if section == :config
        read_from_file setting, value
      else
        value
      end
    end

    # @param [String] setting
    # @param [String] value
    # @return [String]
    # The value is potentially stored in the filesystem.
    def read_from_file(setting, value)
      config_path = Rails.application.root.join("..", value)

      return unless config_path.file?

      case setting
      when :google_service
        config = JSON.parse(config_path.read).to_h

        SettingsService::AdjustGoogleConfig.run! config: config
      end
    end
  end
end
