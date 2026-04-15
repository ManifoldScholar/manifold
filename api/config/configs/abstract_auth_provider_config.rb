# frozen_string_literal: true

# @abstract
class AbstractAuthProviderConfig < ApplicationConfig
  extend Dry::Core::ClassAttributes

  include ActiveModel::Validations

  defines :provider_name, type: Dry::Types["symbol"]
  defines :strategy_name, type: Dry::Types["symbol"]

  config_name :_unused

  provider_name :_unused
  strategy_name :_unused

  attr_config :display_name,
              :instructions,
              :logo,
              enabled: false,
              hidden: false,
              default: false,
              trust_email: true

  coerce_types enabled: :boolean, hidden: :boolean, default: :boolean

  delegate :provider_name, :strategy_name, to: :class

  # This class builder is useful to initialize the `config_name` and `env_prefix`
  # settings. Since some fields for each provider need to be secure, they shouldn't
  # all be stored in a single config. E.G. private keys should be retrieved
  # from the env, not stored in a yml config.
  class << self
    # @param [#to_sym] provider_name
    # @return [Class<AbstractAuthProviderConfig>]
    def build_for(provider_name)
      klass = Class.new(self)

      klass.provider_name(provider_name.to_sym)
      klass.strategy_name strategy_name

      klass.config_name :"#{config_prefix}_#{provider_name}"
      klass.env_prefix :"#{config_prefix}_#{provider_name}"

      klass
    end

    # @param [#to_sym] name
    # @return [Symbol]
    def strategy_name(name = nil)
      name ? @strategy_name = name.to_sym : @strategy_name
    end

    # @param [#to_sym] prefix
    # @return [Symbol]
    def config_prefix(prefix = nil)
      prefix ? @config_prefix = prefix.to_sym : (@config_prefix || @strategy_name)
    end
  end

  def display_name
    super || provider_name.titleize
  end

  def show?
    enabled? && !hidden?
  end

  # @abstract
  # @return [Hash]
  def provider_options
    raise NotImplementedError, "provider_options must be implemented in subclass"
  end

  def provider_args
    [
      strategy_name,
      provider_options
    ]
  end

end
