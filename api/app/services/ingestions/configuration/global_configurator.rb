module Ingestions
  module Configuration
    class GlobalConfigurator
      include ::Concerns::Configurates

      def initialize
        @converters = Ingestions::Configuration::ConverterRegistry.new
        @strategies = Ingestions::Configuration::StrategyRegistry.new
      end

      def configure(&block)
        evaluate(&block) if block_given?

        self
      end

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
