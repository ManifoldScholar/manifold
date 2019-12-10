module ApiDocs
  module Definitions
    module Resource
      def update_request
        definition = make_request(__callee__, update_attributes || request_attributes)

        definition = DryTypesToJson.convert(definition)
        transform_keys(definition)
      end

      def create_request
        definition = make_request(__callee__, create_attributes || request_attributes)

        definition = DryTypesToJson.convert(definition)
        transform_keys(definition)
      end

      def resource_response
        definition = ::Types::Hash.schema(data: resource_response_data)

        definition = DryTypesToJson.convert(definition)
        debug(__callee__, definition)
        transform_keys(definition)
      end

      def collection_response
        definition = ::Types::Hash.schema(
          data: ::Types::Array.of(collection_response_data)
        )

        definition = DryTypesToJson.convert(definition)
        debug(__callee__, definition)
        transform_keys(definition)
      end

      protected

      def update_attributes
        nil
      end

      def create_attributes
        nil
      end

      ####################################
      ############# REQESTS ##############
      ####################################

      def request_attributes
        ::Types::Hash.schema(self::REQUEST_ATTRIBUTES.merge(full_attributes).except(*self::READ_ONLY))
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

      def resource_response_data
        return collection_response_data if serializer.partial_only?

        resource_data(
          wrap_response_attributes(full_attributes),
          wrap_response_relationships(full_relationships)
        )
      end

      def collection_response_data
        resource_data(
          wrap_response_attributes(attributes),
          wrap_response_relationships(relationships)
        )
      end

      def wrap_response_relationships(relationships)
        ::Types::Hash.schema(relationships)
      end

      def wrap_response_attributes(attributes)
        ::Types::Hash.schema(attributes.except(*self::WRITE_ONLY))
      end

      ####################################
      ############# HELPERS ##############
      ####################################

      def resource_data(attributes, relation)
        ::Types::Hash.schema(
          id: ::Types::Serializer::ID,
          type: ::Types::String.meta(example: type),
          attributes: attributes,
          relationships: relation,
          meta: ::Types::Serializer::Meta
        )
      end

      def type
        name.demodulize.pluralize.underscore
      end

      def serializer
        "V1::#{self.name.demodulize}Serializer".constantize
      end

      def attributes
        serializer.register.attribute_types
      end

      def full_attributes
        attributes.merge(serializer.full_register.attribute_types)
      end

      private

      def transform_keys(definition)
        definition.deep_transform_keys { |key| key.to_s.camelize(:lower) }
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
      def make_request(callee, attributes)
        definition = ::Types::Hash.schema(
          data: ::Types::Hash.schema(
            attributes: attributes
          )
        )

        debug(callee, definition)
        definition
      end
    end
  end
end
