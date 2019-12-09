module ApiDocs
  module Definitions
    module Resource
      ####################################
      ############# REQESTS ##############
      ####################################

      def update_request
        definition = make_request(__callee__, update_attributes || request_attributes)
        definition = Definitions::DryTypesToJson.convert(definition)
        transform_keys(definition)
      end

      def create_request
        definition = make_request(__callee__, create_attributes || request_attributes)
        definition = Definitions::DryTypesToJson.convert(definition)
        transform_keys(definition)
      end

      def update_attributes
        nil
      end

      def create_attributes
        nil
      end

      def request_attributes
        ::Types::Hash.schema(self::ATTRIBUTES.merge(attributes).except(*self::READ_ONLY))
      end

      def request_relationships
        Type.object(properties: {})
      end

      def required_create_attributes
        const_defined?(:REQUIRED_CREATE_ATTRIBUTES) ? self::REQUIRED_CREATE_ATTRIBUTES : required_attributes
      end

      def required_update_attributes
        const_defined?(:REQUIRED_UPDATE_ATTRIBUTES) ? self::REQUIRED_UPDATE_ATTRIBUTES : required_attributes
      end

      def required_attributes
        const_defined?(:REQUIRED_ATTRIBUTES) ? self::REQUIRED_ATTRIBUTES : []
      end

      ######################################
      ############# RESPONSES ##############
      ######################################

      def resource_data(attr, realtion)
        ::Types::Hash.schema(
          id: ::Types::Serializer::ID,
          type: ::Types::String.meta(example: type),
          attributes: attr,
          relationships: realtion,
          meta: ::Types::Serializer::Meta
        )
      end

      def resource_response_data
        return collection_response_data if serializer.partial_only?

        resource_data(
          response_attributes(full_attributes),
          response_relationships(full_relationships)
        )
      end

      def resource_response
        definition = ::Types::Hash.schema(data: resource_response_data)

        definition = Definitions::DryTypesToJson.convert(definition)
        debug(__callee__, definition)
        transform_keys(definition)
      end

      def collection_response
        definition = ::Types::Hash.schema(
          data: ::Types::Array.of(collection_response_data)
        )

        definition = Definitions::DryTypesToJson.convert(definition)
        debug(__callee__, definition)
        transform_keys(definition)
      end

      def collection_response_data
        resource_data(
          response_attributes(attributes),
          response_relationships(relationships)
        )
      end

      def response_relationships(realtion)
        ::Types::Hash.schema(realtion)
      end

      def response_attributes(attr)
        ::Types::Hash.schema(self::ATTRIBUTES.merge(attr).except(*self::WRITE_ONLY))
      end

      ####################################
      ############# HELPERS ##############
      ####################################

      def serializer
        "V1::#{self.name.demodulize}Serializer".constantize
      end

      def attributes
        serializer.register.attribute_types
      end

      def full_attributes
        attributes.merge(serializer.full_register.attribute_types)
      end

      def map_serializer_types(hash)
        hash.map { |k,v| if v == :has_many then [k, ::Types::Serializer::Collection] else [k, ::Types::Serializer::Resource] end }.to_h
      end

      def relationships
        partial = serializer.register.relationship_types
        map_serializer_types(partial)
      end

      def full_relationships
        full = serializer.full_register.relationship_types
        full = map_serializer_types(full)
        relationships.merge(full)
      end

      protected

      def transform_keys(definition)
        definition.deep_transform_keys { |key| key.to_s.camelize(:lower) }
      end

      def type
        name.demodulize.pluralize.underscore
      end

      private

      def debug(callee, definition)
        return unless ENV["RSWAG_DEBUG"]

        puts "-" * 80
        puts "#{self}##{callee}"
        puts "-" * 80
        pp definition
        puts "-" * 80
        puts "\n"
      end

      # TODO: Note required fields on request types
      def make_request(callee, attr)
        definition = ::Types::Hash.schema(
          data: ::Types::Hash.schema(
            attributes: attr
          )
        )

        debug(callee, definition)
        definition
      end
    end
  end
end
