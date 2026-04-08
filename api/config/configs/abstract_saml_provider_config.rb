# frozen_string_literal: true

# @abstract
class AbstractSamlProviderConfig < ApplicationConfig
  extend Dry::Core::ClassAttributes

  include ActiveModel::Validations

  defines :provider_name, type: Dry::Types["symbol"]

  config_name :_unused

  provider_name :_unused

  attr_config :endpoint,
              :display_name,
              :logo,
              :instructions,
              :sp_entity_id,
              :idp_entity_id,
              :idp_sso_service_url,
              :idp_slo_service_url, # Not currently used
              :idp_cert,
              :idp_signing_cert,
              :idp_encryption_cert,
              :certificate,
              :private_key,
              :idp_cert_fingerprint,
              enabled: false,
              hidden: false,
              default: false,
              metadata_signed: true,
              authn_requests_signed: true,
              want_assertions_signed: true,
              name_identifier_format: "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent"

  coerce_types enabled: :boolean, hidden: :boolean, default: :boolean

  delegate :provider_name, to: :class

  # This class builder is useful to initialize the `config_name` and `env_prefix`
  # settings. Since some fields for each provider need to be secure, they shouldn't
  # all be stored in a single config. E.G. private keys should be retrieved
  # from the env, not stored in a yml config.
  class << self
    # @param [#to_sym] provider_name
    # @return [Class<AbstractSamlProviderConfig>]
    def build_for(provider_name)
      klass = Class.new(AbstractSamlProviderConfig)

      klass.provider_name(provider_name.to_sym)

      klass.config_name :"saml_#{provider_name}"
      klass.env_prefix :"saml_#{provider_name}"

      klass
    end
  end

  def display_name
    super || provider_name.titleize
  end

  def show?
    enabled? && !hidden?
  end

  def provider_options
    to_h
    .merge(security_options)
    .merge(derived_attrs)
    .compact
  end

  def derived_attrs
    {
      name: provider_name,
      request_attributes: saml_attributes,
      attribute_statements: attribute_mappings
    }
  end

  def security_options
    {
      security: {
        metadata_signed:,
        authn_requests_signed:,
        want_assertions_signed:,
        digest_method: XMLSecurity::Document::SHA256,
        signature_method: XMLSecurity::Document::RSA_SHA256
      }
    }
  end

  def provider_args
    [
      :saml,
      provider_options
    ]
  end

  def saml_attributes
    [
      {
        name: "email",
        friendly_name: "Email Address",
        name_format: "urn:oasis:names:tc:SAML:2.0:attrname-format:emailAddress",
        is_required: true
      },
      {
        name: "first_name",
        friendly_name: "First Name",
        name_format: "urn:oasis:names:tc:SAML:2.0:attrname-format:basic",
        is_required: true
      },
      {
        name: "last_name",
        friendly_name: "Last Name",
        name_format: "urn:oasis:names:tc:SAML:2.0:attrname-format:basic",
        is_required: true
      },
      {
        name: "entitlements",
        friendly_name: "Entitlements",
        name_format: "urn:oasis:names:tc:SAML:2.0:attrname-format:basic",
        is_required: false
      },
      {
        name: "user_groups",
        friendly_name: "User Groups",
        name_format: "urn:oasis:names:tc:SAML:2.0:attrname-format:basic",
        is_required: false
      }
    ]
  end

  def attribute_mappings
    saml_attributes.each_with_object({}) do |attr, memo|
      memo[attr[:name].to_s.downcase.to_sym] = [attr[:name].to_s]
    end
  end
end
