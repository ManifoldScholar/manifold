module Ingestions
  module Configuration
    class GlobalConfigurator
      include ::Configurates

      def initialize
        @converters = Ingestions::Configuration::ConverterRegistry.new
        @strategies = Ingestions::Configuration::StrategyRegistry.new
        @fetchers = Ingestions::Configuration::FetcherRegistry.new
      end

      def configure(&block)
        evaluate(&block) if block_given?

        self
      end

      def fetchers(&block)
        @fetchers.configure(&block)
      end

      expose :fetchers

      def converters(&block)
        @converters.configure(&block)
      end

      expose :converters

      def strategies(&block)
        @strategies.configure(&block)
      end

      expose :strategies
    end
  end
end
