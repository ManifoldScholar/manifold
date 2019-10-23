module ApiDocs
  module Helpers
    module Inflections
      def request_types
        [:create, :update]
      end

      def response_types
        [:collection, :resource]
      end

      def resource_klass(resource)
        klass = "ApiDocs::Definition::Resource::#{resource.to_s.camelize}".constantize
      end

      def request_or_response(type)
        return :request if request_types.include? type

        :response
      end

      def type_from_action(action, request_or_response)
        request = request_or_response == :request
        return :create if action == :create && request
        return :update if action == :update && request
        return :collection if action == :index && !request

        :resource
      end

      def definition_name_for(resource, type)
        "#{resource.capitalize}#{type.capitalize}#{request_or_response(type).capitalize}"
      end

      def type_method(type)
        "#{type}_#{request_or_response(type)}"
      end

      def definitions_for(resource)
        out = (request_types + response_types).map do |type|
          [definition_name_for(resource, type), resource_klass(resource).send(type_method(type))]
        end.to_h
        pp out
        out
      end
    end
  end
end
