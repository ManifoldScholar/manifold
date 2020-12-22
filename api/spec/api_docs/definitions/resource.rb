module APIDocs
  module Definitions
    module Resource
      def update_request
        attributes = assign_required_attributes(
          (update_attributes || request_attributes),
          required_update_attributes
        )

        relationships = assign_required_attributes(update_relationships, required_update_relationships)

        definition = make_request(attributes, relationships)
        parse_dry_types(__callee__, definition)
      end

      def create_request
        attributes = assign_required_attributes(
          (create_attributes || request_attributes),
          required_create_attributes
        )

        relationships = assign_required_attributes(create_relationships, required_create_relationships)

        definition = make_request(attributes, relationships)
        parse_dry_types(__callee__, definition)
      end

      def resource_response(paginated: false)
        schema = {
          data: resource_response_data,
          meta: (Types::Serializer::PaginatedMeta if paginated)
        }.compact

        definition = ::Types::Hash.schema(schema)
        parse_dry_types(__callee__, definition)
      end

      def collection_response(paginated: false)
        schema = {
          data: ::Types::Array.of(partial_resource_response_data),
          meta: (Types::Serializer::PaginatedMeta if paginated)
        }.compact

        definition = ::Types::Hash.schema(schema)
        parse_dry_types(__callee__, definition)
      end

      protected

      def update_attributes
        nil
      end

      def create_attributes
        nil
      end

      def create_relationships
        nil
      end

      def update_relationships
        nil
      end

      #####################################
      ############# REQUESTS ##############
      #####################################

      def request_attributes
        attributes = write_only_attributes.merge(all_attributes).except(*read_only_attributes)
        expand_attributes(attributes, :request)
      end

      def required_create_attributes
        const_defined?(:REQUIRED_CREATE_ATTRIBUTES) ? self::REQUIRED_CREATE_ATTRIBUTES : required_attributes
      end

      def required_update_attributes
        const_defined?(:REQUIRED_UPDATE_ATTRIBUTES) ? self::REQUIRED_UPDATE_ATTRIBUTES : required_attributes
      end

      def required_create_relationships
        const_defined?(:REQUIRED_CREATE_RELATIONSHIPS) ? self::REQUIRED_CREATE_RELATIONSHIPS : nil
      end

      def required_update_relationships
        const_defined?(:REQUIRED_UPDATE_RELATIONSHIPS) ? self::REQUIRED_UPDATE_RELATIONSHIPS : nil
      end

      def required_attributes
        const_defined?(:REQUIRED_ATTRIBUTES) ? self::REQUIRED_ATTRIBUTES : []
      end

      def write_only_attributes
        return {} unless const_defined?(:REQUEST_ATTRIBUTES)

        raise("Error: REQUEST_ATTRIBUTES requires a hash with dry type definitions") unless self::REQUEST_ATTRIBUTES.is_a? Hash

        self::REQUEST_ATTRIBUTES
      end

      def assign_required_attributes(contents, required_values)
        return nil if contents.nil?
        raise "contents must be a hash" unless contents.is_a?(Hash)

        attributes = ::Types::Hash.schema(contents)
        attributes = attributes.meta(required: required_values) if required_values.present?
        attributes
      end

      def make_request(attributes, relationships)
        ::Types::Hash.schema(
          data: ::Types::Hash.schema(
            {
              attributes: (attributes unless attributes.nil?),
              relationships: (relationships unless relationships.nil?)
            }.compact
          )
        )
      end

      ######################################
      ############# RESPONSES ##############
      ######################################

      def resource_response_data
        return nil unless serializer
        return partial_resource_response_data if serializer.partial_only?

        full_resource_response_data
      end

      def full_resource_response_data
        resource_data(
          attributes: (filter_response_attributes(all_attributes) if all_attributes?),
          relationships: (full_relationships if full_relationships?)
        )
      end

      def partial_resource_response_data
        resource_data(
          attributes: (filter_response_attributes(attributes) if attributes?),
          relationships: (relationships if relationships?)
        )
      end

      def read_only_attributes
        APIDocumentation::DryTypesParser.read_only_attributes(all_attributes)
      end

      def filter_response_attributes(attributes)
        attributes.except(*write_only_attributes)
      end

      def id_type
        const_defined?(:ID_TYPE) ? self::ID_TYPE : ::Types::Serializer::ID
      end

      ####################################
      ############# HELPERS ##############
      ####################################

      def expand_attributes(attributes, type = :response)
        return attributes if attributes.nil?

        # If we have other nested hashes that need special treatment in the future,
        # we can address them here.
        expand_with_metadata(attributes, type)
      end

      def expand_with_metadata(attributes, type = :response)
        return attributes unless attributes.key? :metadata_properties
        raise "METADATA_ATTRIBUTES must be defined on #{name}" unless self::METADATA_ATTRIBUTES

        metadata = {
          metadata: ::Types::Hash.schema(self::METADATA_ATTRIBUTES)
        }
        if type == :response
          metadata[:metadata_formatted] = ::Types::Hash.schema(self::METADATA_ATTRIBUTES)
          metadata[:metadata_properties] = ::Types::Array.of(::Types::String)
        end
        attributes.merge(metadata)
      end

      def resource_data(attributes: nil, relationships: nil)
        expanded_attributes = expand_attributes(attributes)
        data = {
          id: id_type,
          type: ::Types::String.meta(example: type.camelize(:lower)),
          attributes: (::Types::Hash.schema(expanded_attributes) unless expanded_attributes.nil?),
          relationships: (::Types::Hash.schema(relationships) unless relationships.nil?),
          meta: ::Types::Serializer::Meta
        }.compact

        ::Types::Hash.schema(data)
      end

      def type
        name.demodulize.pluralize.underscore
      end

      def serializer
        "V1::#{name.demodulize}Serializer".constantize
      rescue NameError
        nil
      end

      def attributes
        serializer.register.attribute_types
      end

      def attributes?
        attributes.present?
      end

      def all_attributes
        attributes.merge(serializer.full_register.attribute_types)
      end

      def all_attributes?
        all_attributes.present?
      end

      private

      def parse_dry_types(callee, definition)
        definition = APIDocumentation::DryTypesParser.convert(definition)
        debug(callee, definition)
        transform_keys(definition)
      end

      def transform_keys(definition)
        definition.deep_transform_keys { |key| key.to_s.camelize(:lower) }
      end

      def map_serializer_types(hash)
        hash.map { |k, v| v == :has_many ? [k, ::Types::Serializer::Collection] : [k, ::Types::Serializer::Resource] }.to_h
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
