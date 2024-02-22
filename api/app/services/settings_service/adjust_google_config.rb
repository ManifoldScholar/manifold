# frozen_string_literal: true

module SettingsService
  # Rearrange settings provided in an unprefixed JSON structure into
  # a shape that can be cleanly merged into {Settings}.
  #
  # @see SettingSections::Integrations
  # @see SettingSections::Secrets
  # @see SettingsService::ReadFromEnv#read_from_file
  # @see Updaters::Settings#adjust_google_config
  class AdjustGoogleConfig < ActiveInteraction::Base
    hash :config, strip: false

    # This corresponds to the name of a {SectionSettings::Base} section
    # as keys, and a list of unprefixed keys expected to be found in the input hash.
    #
    # They will be transformed so that each one is prefixed with `google_`, and stored
    # under the corresponding section name.
    #
    # @api private
    GOOGLE_KEYS = {
      secrets: %w(private_key),
      integrations: %w(private_key_id project_id client_email client_id)
    }.freeze

    # A remapping of {GOOGLE_KEYS} to make the lookup simpler.
    #
    # @api private
    SETTING_KEYS = GOOGLE_KEYS.each_with_object({}.with_indifferent_access) do |(setting_key, config_keys), mapping|
      config_keys.each do |config_key|
        mapping[config_key] = setting_key
      end
    end.freeze

    # @return [ActiveSupport::HashWithIndifferentAccess]
    def execute
      output = GOOGLE_KEYS.keys.index_with { {} }

      config.each_with_object(output) do |(k, v), out|
        setting_key = SETTING_KEYS[k]

        # :nocov:
        next if setting_key.nil?
        # :nocov:

        out[setting_key][:"google_#{k}"] = v
      end
    end
  end
end
