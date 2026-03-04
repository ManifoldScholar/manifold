# frozen_string_literal: true

class AuthConfig < ApplicationConfig
  PROVIDER_NAME_FORMAT = /[a-z]/

  attr_config disable_password_auth: false,
              oidc_provider_names: [],
              saml_provider_names: []

  coerce_types disable_password_auth: :boolean,
               oidc_provider_names: { type: :string, array: true },
               saml_provider_names: { type: :string, array: true }

  on_load :validate_provider_names!

  # @return [Array[String]]
  def provider_names
    oidc_provider_names + saml_provider_names
  end

  # @return [Array<AbstractAuthProviderConfig>]
  def providers
    oidc_providers + saml_providers
  end

  # @return [Array<AbstractOidcProviderConfig>]
  def oidc_providers
    @oidc_providers ||= raw_oidc_providers.select { _1.valid? && _1.enabled? }
  end

  # @return [Array<AbstractOidcProviderConfig>]
  def raw_oidc_providers
    @raw_oidc_providers ||= build_raw_oidc_providers
  end

  # @return [Array<AbstractSamlProviderConfig>]
  def saml_providers
    @saml_providers ||= raw_saml_providers.select { _1.valid? && _1.enabled? }
  end

  # @return [Array<AbstractSamlProviderConfig>]
  def raw_saml_providers
    @raw_providers ||= build_raw_saml_providers
  end

  private

  def build_raw_oidc_providers
    oidc_provider_names.map do |provider_name|
      klass = AbstractOidcProviderConfig.build_for(provider_name)
      klass.new
    end
  end

  # @return [Array<AbstractSamlProviderConfig>]
  def build_raw_saml_providers
    saml_provider_names.map do |provider_name|
      klass = AbstractSamlProviderConfig.build_for(provider_name)
      klass.new
    end
  end

  # @return [void]
  def validate_provider_names!
    problematic_names = (oidc_provider_names + saml_provider_names).grep_v(PROVIDER_NAME_FORMAT)

    raise_validation_error("Invalid SAML provider names: #{problematic_names.join(', ')}") if problematic_names.any?
  end
end
