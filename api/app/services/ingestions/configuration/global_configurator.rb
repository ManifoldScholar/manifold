# frozen_string_literal: true

module Ingestions
  module Configuration
    class GlobalConfigurator
      include ::Configurates

      def initialize
        @converters = Ingestions::Configuration::ConverterRegistry.new
        @strategies = Ingestions::Configuration::StrategyRegistry.new
        @fetchers = Ingestions::Configuration::FetcherRegistry.new
      end

      def configure(&)
        evaluate(&) if block_given?

        self
      end

      def fetchers(&)
        @fetchers.configure(&)
      end

      expose :fetchers

      def converters(&)
        @converters.configure(&)
      end

      expose :converters

      def strategies(&)
        @strategies.configure(&)
      end

      expose :strategies
    end
  end
end
