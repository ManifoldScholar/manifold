module ApiDocs
  module Definition
    module Resource
      def resource_response
        definition = Type.object(
          properties: {
            data: Type.object(properties: {
                                id: Type.id,
                                type: Type.string(example: type),
                                attributes: Type.object(properties: response_attributes),
                                relationships: response_relationships,
                                meta: Type.meta
                              })
          }
        )
        debug(__callee__, definition)
        transform_keys(definition)
      end

      def collection_response
        definition = Type.object(
          properties: {
            data: Type.array(
              items: collection_resource_response || resource_response
            )
          }
        )
        debug(__callee__, definition)
        transform_keys(definition)
      end

      def update_request
        definition = make_request(__callee__, update_attributes || request_attributes)
        transform_keys(definition)
      end

      def create_request
        definition = make_request(__callee__, create_attributes || request_attributes)
        transform_keys(definition)
      end

      protected

      def transform_keys(definition)
        definition.deep_transform_keys { |key| key.to_s.camelize(:lower) }
      end

      def collection_resource_response
        nil
      end

      def update_attributes
        nil
      end

      def create_attributes
        nil
      end

      def response_relationships
        Type.object(properties: self::RELATIONSHIPS)
      end

      def response_attributes
        self::ATTRIBUTES.except(*self::WRITE_ONLY)
      end

      def request_attributes
        self::ATTRIBUTES.except(*self::READ_ONLY)
      end

      def request_relationships
        Type.object(properties: {})
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

      def type
        name.demodulize.pluralize.underscore
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

      private

      def make_request(callee, attributes)
        required = case callee
                   when :create_request
                     required_create_attributes
                   when :update_request
                     required_update_attributes
                   else
                     required_attributes
        end

        definition = Type.object(
          nullable: false,
          properties: {
            data: Type.object(
              nullable: false,
              properties: {
                attributes: Type.object(
                  required: required,
                  properties: attributes
                )
              }
            )
          }
        )

        debug(callee, definition)
        definition
      end
    end
  end
end
