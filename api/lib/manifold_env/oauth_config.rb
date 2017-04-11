module ManifoldEnv
  # rubocop:disable Style/AndOr, Style/ClassCheck, Metrics/BlockLength, Metrics/LineLength
  class OauthConfig
    include ManifoldEnv::HasConfigurationDSL
    include Enumerable

    def initialize
      @providers = SortedSet.new
    end

    # @param [Symbol] name
    # @return [ManifoldEnv::OauthProvider]
    def [](name)
      @providers.detect do |definition|
        definition =~ name
      end or raise ManifoldEnv::UnknownProvider, "Unknown provider: #{name}"
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

    def as_json(_options = nil)
      each_with_object({}) do |provider, hsh|
        hsh[provider.strategy_name] = {
          enabled: provider.enabled?
        }
      end
    end

    dsl do
      ivar_reader :providers

      def provider(name, &config)
        name = name.to_sym unless name.kind_of?(Symbol)

        definition = ManifoldEnv::OauthProvider.new(name)

        providers.add?(definition) or raise DefinedProvider, "Already defined provider: #{name}"

        definition.configure(&config)
      end
    end

    class DefinedProvider < ArgumentError
    end

    class UnknownProvider < KeyError
    end
  end
end
