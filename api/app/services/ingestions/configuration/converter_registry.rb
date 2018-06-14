module Ingestions
  module Configuration
    # @api private
    class ConverterRegistry < AbstractRegistry
      infer_defaults!

      def convertible_extensions
        Ingestions.converters.collect_concat do |definition|
          definition.interaction.convertible_extensions
        end
      end

    end
  end
end
