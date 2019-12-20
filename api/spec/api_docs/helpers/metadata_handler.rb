module ApiDocs
  module Helpers
    class MetadataHandler
      def initialize(name, metadata_attributes)
        @name = name
        @metadata_attributes = metadata_attributes
      end

      def validate_metadata_attributes!
        raise "Metadata defined on the #{@name.demodulize} model and METADATA_ATTRIBUTES was not defined in #{@name}" if metadata_missing?
        return unless model? && model.respond_to?(:metadata_properties)
        model.metadata_properties.each do |property|
          raise "Missing #{property} on #{@name}::METADATA_ATTRIBUTES" unless @metadata_attributes.has_key?(property.to_sym)
        end
      end

      def request_metadata
        metadata.slice(:metadata)
      end

      def response_metadata
        metadata
      end

      def metadata?
        metadata_properties.present?
      end

      def metadata_properties
        return [] unless model?
        return model.metadata_properties if model.respond_to?(:metadata_properties)
        []
      end

      private

      def metadata
        {
          metadata: ::Types::Hash.schema(@metadata_attributes),
          metadata_formatted: ::Types::Hash.schema(@metadata_attributes),
          metadata_properties: ::Types::Array.of(::Types::String)
        }
      end

      def model
        @name.demodulize.constantize
      end

      def model?
        Object.const_defined?(@name.demodulize)
      end

      def metadata_missing?
        return false unless model?
        model.respond_to?(:metadata_properties) && !@metadata_attributes
      end
    end
  end
end
