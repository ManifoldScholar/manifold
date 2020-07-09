module ManifoldEnv
  class OauthConfig
    include ManifoldEnv::HasConfigurationDSL
    include Enumerable

    before_configure :load_raw_custom_oauth_configuration!
    before_configure :load_custom_providers!

    after_configure :configure_custom_providers!

    def initialize
      @raw_custom_oauth_configuration = {}.with_indifferent_access
      @custom_providers = {}.with_indifferent_access
      @providers = SortedSet.new
    end

    # @param [Symbol] name
    # @return [ManifoldEnv::OauthProvider]
    def [](name)
      @providers.detect do |definition|
        definition =~ name
      end or raise ManifoldEnv::UnknownProvider, "Unknown provider: #{name}"
    end

    attr_reader :custom_providers, :raw_custom_oauth_configuration

    def custom(provider_name)
      @custom_providers[provider_name]
    end

    def each
      return enum_for(__method__) unless block_given?

      @providers.each do |provider|
        yield provider
      end
    end

    def enabled
      return enum_for(__method__) unless block_given?

      @providers.select(&:enabled?).each do |provider|
        yield provider
      end
    end

    # @return [<String>]
    def known_strategies
      map { |p| p.strategy_name.to_s }
    end

    def as_json(options = nil)
      each_with_object({}) do |provider, hsh|
        hsh[provider.strategy_name] = provider.as_json(options)
      end
    end

    dsl do
      ivar_reader :providers

      def provider(name, &config)
        name = name.to_sym unless name.is_a?(Symbol)

        definition = ManifoldEnv::OauthProvider.new(name)

        providers.add?(definition) or raise DefinedProvider, "Already defined provider: #{name}"

        definition.configure(&config)
      end
    end

    private

    # @return [void]
    def configure_custom_providers!
      @custom_providers.each_key do |provider_name|
        definition = ManifoldEnv::OauthProvider.new provider_name.to_sym

        @providers.add definition

        definition.configure
      end
    end

    # @return [void]
    def load_raw_custom_oauth_configuration!
      @raw_custom_oauth_configuration = Rails.application.config_for(:oauth, env: "oauth").with_indifferent_access
    rescue RuntimeError
      @raw_custom_oauth_configuration = {}.with_indifferent_access
    end

    # @return [void]
    def load_custom_providers!
      raw_custom_oauth_configuration.each do |provider_name, provider_options|
        options = provider_options.merge(name: provider_name).symbolize_keys

        @custom_providers[provider_name] = ManifoldEnv::CustomOauthProvider.new options
      end
    end

    class DefinedProvider < ArgumentError
    end

    class UnknownProvider < KeyError
    end
  end
  # rubocop:enable
end
