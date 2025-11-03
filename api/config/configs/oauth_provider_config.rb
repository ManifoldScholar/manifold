# frozen_string_literal: true

class OauthProviderConfig < ApplicationConfig
  class << self
    private

    def coerced_endpoints
      lambda do |endpoints_hash|
        endpoints_hash.transform_values do |value|
          OauthProviderEndpointConfig.new(**value)
        end
      end
    end
  end

  attr_config(
    :client_id,
    :client_secret,
    :descriptive_name,
    :host,
    :protocol,
    :email_key,
    :name_key,
    :nickname_key,
    :secret,
    :strategy_options,
    :uid_key
  )

  attr_config(
    endpoints: {},
    strategy_name: nil
  )

  coerce_types endpoints: coerced_endpoints

  on_load :ensure_credentials

  def ensure_credentials
    rails_validation_error("configuration must include client_id and client_secret") if credentials.blank?
  end

  def full_strategy_options
    {}.merge(strategy_options || {}).tap do |h|
      h[:strategy_class] = custom.strategy_class if custom?
    end.presence
  end

  def provider_args
    [strategy_name, *credentials, strategy_options].compact
  end

  def enabled?
    false
  end

  def credentials
    [client_id, client_secret]
  end
end
