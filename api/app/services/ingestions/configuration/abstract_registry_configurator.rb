module Ingestions
  module Configuration
    class AbstractRegistryConfigurator
      include Configurates

      # @param [Ingestions::Configuration::AbstractRegistry] registry
      def initialize(registry)
        @registry = registry
      end

      # @!attribute [r] registry
      # @return [Ingestions::Configuration::AbstractRegistry]
      attr_reader :registry
    end
  end
end
