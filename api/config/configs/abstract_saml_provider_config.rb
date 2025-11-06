# frozen_string_literal: true

# @abstract
class AbstractSamlProviderConfig < ApplicationConfig
  extend Dry::Core::ClassAttributes

  include ActiveModel::Validations

  defines :provider_name, type: Dry::Types["symbol"]

  config_name :_unused

  provider_name :_unused

  attr_config :endpoint

  validates :endpoint, url: true, presence: true

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
end
