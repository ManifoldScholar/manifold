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
    :app_id,
    :app_secret,
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
    [client_secret]
  end
end
