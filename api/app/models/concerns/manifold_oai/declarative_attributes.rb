# frozen_string_literal: true

module ManifoldOAI
  module DeclarativeAttributes
    extend ActiveSupport::Concern

    class_methods do
      # Defines an instance method for each declared attribute.
      #
      # @param [Hash{Symbol=>Object, Proc, Symbol}] attributes
      # @return [void]
      def define_oai_attributes(attributes)
        attributes.each do |method_name, value|
          next if value.nil?

          define_method(method_name) { resolve_oai_attribute(value) }
        end
      end
    end

    private

    # Resolves a declared value against the record instance.
    #
    # @param [Object, Proc, Symbol] value
    # @return [Object]
    def resolve_oai_attribute(value)
      case value
      when Proc then instance_exec(&value)
      when Symbol then send(value)
      else value
      end
    end
  end
end
