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
    valid_oidc_providers + valid_saml_providers
  end

  # @return [Array<AbstractOidcProviderConfig>]
  def valid_oidc_providers
    @valid_oidc_providers ||= all_oidc_providers.select { it.valid? && it.enabled? }
  end

  # @return [Array<AbstractSamlProviderConfig>]
  def valid_saml_providers
    @valid_saml_providers ||= all_saml_providers.select { it.valid? && it.enabled? }
  end

  # @return [Array<AbstractOidcProviderConfig>]
  def all_oidc_providers
    @all_oidc_providers ||= build_oidc_providers
  end

  # @return [Array<AbstractSamlProviderConfig>]
  def all_saml_providers
    @all_saml_providers ||= build_saml_providers
  end

  def provider_for(name)
    if oidc_provider_names.include? name.to_s
      oidc_provider_for(name)
    elsif saml_provider_names.include? name.to_s
      saml_provider_for(name)
    end
  end

  # @return [AbstractOidcProviderConfig, nil]
  def oidc_provider_for(name)
    valid_oidc_providers.find { it.provider_name == name.to_sym }
  end

  # @return [AbstractSamlProviderConfig, nil]
  def saml_provider_for(name)
    valid_saml_providers.find { it.provider_name == name.to_sym }
  end

  private

  def build_oidc_providers
    oidc_provider_names.map do |provider_name|
      AbstractOidcProviderConfig.build_for(provider_name).new
    end
  end

  # @return [Array<AbstractSamlProviderConfig>]
  def build_saml_providers
    saml_provider_names.map do |provider_name|
      AbstractSamlProviderConfig.build_for(provider_name).new
    end
  end

  # @return [void]
  def validate_provider_names!
    problematic_names = (oidc_provider_names + saml_provider_names).grep_v(PROVIDER_NAME_FORMAT)

    raise_validation_error("Invalid SAML provider names: #{problematic_names.join(', ')}") if problematic_names.any?
  end
end
