module ApiDocs
  module Definitions
    module Resource
      def update_request
        definition = make_request(__callee__, update_attributes || request_attributes)

        definition = ApiDocumentation::DryTypesParser.convert(definition)
        transform_keys(definition)
      end

      def create_request
        definition = make_request(__callee__, create_attributes || request_attributes)

        definition = ApiDocumentation::DryTypesParser.convert(definition)
        transform_keys(definition)
      end

      def resource_response
        definition = ::Types::Hash.schema(data: resource_response_data)

        definition = ApiDocumentation::DryTypesParser.convert(definition)
        debug(__callee__, definition)
        transform_keys(definition)
      end

      def collection_response
        definition = ::Types::Hash.schema(
          data: ::Types::Array.of(partial_response_data)
        )

        definition = ApiDocumentation::DryTypesParser.convert(definition)
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

      #####################################
      ############# REQUESTS ##############
      #####################################

      def request_attributes
        write_only_attributes.merge(full_attributes).except(*read_only_attributes)
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

      def write_only_attributes
        return {} unless const_defined?(:REQUEST_ATTRIBUTES)

        raise("Error: REQUEST_ATTRIBUTES requires a hash with dry type definitions") unless self::REQUEST_ATTRIBUTES.is_a? Hash
        self::REQUEST_ATTRIBUTES
      end

      def make_request(callee, attributes)
        attributes = ::Types::Hash.schema(attributes)
        attributes = attributes.meta(required: required_create_attributes) if required_create_attributes.present? && callee == :create_request
        attributes = attributes.meta(required: required_update_attributes) if required_update_attributes.present? && callee == :update_request

        definition = ::Types::Hash.schema(
          data: ::Types::Hash.schema(
            attributes: attributes
          )
        )

        debug(callee, definition)
        definition
      end

      ######################################
      ############# RESPONSES ##############
      ######################################

      def resource_response_data
        return partial_response_data if serializer.partial_only?

        resource_data(
          attributes: (wrap_response_attributes(full_attributes) if full_attributes?),
          relationships: (wrap_response_relationships(full_relationships) if full_relationships?),
        )
      end

      def partial_response_data
        resource_data(
          attributes: (wrap_response_attributes(attributes) if attributes?),
          relationships: (wrap_response_relationships(relationships) if relationships?),
        )
      end

      def wrap_response_relationships(relationships)
        ::Types::Hash.schema(relationships)
      end

      def wrap_response_attributes(attributes)
        ::Types::Hash.schema(attributes.except(*write_only_attributes))
      end

      def read_only_attributes
        ApiDocumentation::DryTypesParser.read_only_attributes(full_attributes)
      end

      ####################################
      ############# HELPERS ##############
      ####################################

      def resource_data(attributes: nil, relationships: nil)
        data = {
          id: ::Types::Serializer::ID,
          type: ::Types::String.meta(example: type),
          attributes: (attributes unless attributes.nil?),
          relationships: (relationships unless relationships.nil?),
          meta: ::Types::Serializer::Meta
        }.compact

        ::Types::Hash.schema(data)
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

      def attributes?
        attributes.present?
      end

      def full_attributes
        attributes.merge(serializer.full_register.attribute_types)
      end

      def full_attributes?
        attributes.present?
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

      def relationships?
        relationships.present?
      end

      def full_relationships
        full = serializer.full_register.relationship_types
        full = map_serializer_types(full)
        relationships.merge(full)
      end

      def full_relationships?
        full_relationships.present?
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
    end
  end
end
