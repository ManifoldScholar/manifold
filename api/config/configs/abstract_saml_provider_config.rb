# frozen_string_literal: true

# @abstract
class AbstractSamlProviderConfig < ApplicationConfig
  extend Dry::Core::ClassAttributes

  include ActiveModel::Validations

  defines :provider_name, type: Dry::Types["symbol"]

  config_name :_unused

  provider_name :_unused
  attr_config enabled: false,
        subdomains: [],
        display_name: "SAML",
        logo: nil,
        instructions: nil,
        sp_entity_id: nil,
        idp_entity_id: nil,
        idp_sso_service_url: nil,
        idp_slo_service_url: nil,
        idp_cert: nil,
        idp_signing_cert: nil,
        idp_encryption_cert: nil,
        certificate: nil,
        private_key: nil,
        idp_cert_fingerprint: nil,
        primary_attribute_name: "uid",
        email_attribute_name: "email",
        first_name_attribute_name: "first_name",
        last_name_attribute_name: "last_name"
  attr_config :endpoint

  validates :endpoint, url: true, presence: true
  required :sp_entity_id, :idp_sso_service_url

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

  def provider_args
    [
      self.class.provider_name,
      to_h
    ]
  end
end
