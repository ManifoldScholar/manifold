# frozen_string_literal: true

class SamlConfig < ApplicationConfig
  PROVIDER_NAME_FORMAT = /[a-z]/

  attr_config disable_password_auth: false,
              disallow_email_change: false,
              provider_names: []

  coerce_types disable_password_auth: :boolean,
               disallow_email_change: :boolean,
               provider_names: { type: :string, array: true }

  on_load :validate_provider_names!

  # @return [Array<AbstractSamlProviderConfig>]
  def providers
    @providers ||= raw_providers.select { it.valid? && it.enabled? }
  end

  # @return [Array<AbstractSamlProviderConfig>]
  def raw_providers
    @raw_providers ||= build_raw_providers
  end

  private

  # @return [Array<AbstractSamlProviderConfig>]
  def build_raw_providers
    provider_names.map do |provider_name|
      klass = AbstractSamlProviderConfig.build_for(provider_name)
      klass.new
    end
  end

  # @return [void]
  def validate_provider_names!
    problematic_names = provider_names.grep_v(PROVIDER_NAME_FORMAT)

    raise_validation_error("Invalid SAML provider names: #{problematic_names.join(', ')}") if problematic_names.any?
  end
end
