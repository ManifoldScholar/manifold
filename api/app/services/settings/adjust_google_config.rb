# Service object to format settings as we want
class Settings < ApplicationRecord
  class AdjustGoogleConfig < ActiveInteraction::Base
    hash :config, strip: false

    GOOGLE_KEYS = {
      secrets: %w(private_key),
      integrations: %w(private_key_id project_id client_email client_id)
    }.freeze

    # @return [void]
    def execute
      adjust_google_config! config
    end

    private

    def setting_key_for_google(key)
      GOOGLE_KEYS.detect do |setting_key, keys|
        return setting_key if key.to_s.in? keys
      end
    end

    def adjust_google_config!(attributes)
      attributes.each_with_object({}) do |(k, v), out|
        setting_key = setting_key_for_google(k)

        next attributes.delete(k) if setting_key.nil?

        out[setting_key] ||= {}
        out[setting_key]["google_#{k}".to_sym] = v
      end
    end
  end
end
