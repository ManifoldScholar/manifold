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

      # Return what type the action should respond to
      # action types: create, update, destroy, index, show
      # request types: request, response
      # returns: create, update, collection or resource
      def type_from_action(action, request_or_response)
        if request_or_response == :request
          return :create if action == :create
          return :update if action == :update
        else
          return :collection if action == :index
        end

        :resource
      end

      def definition_name_for(resource, type)
        "#{resource.capitalize}#{type.capitalize}#{request_or_response(type).capitalize}"
      end

      # returns examples: create_request, create_response, update_request, etc
      def type_method(type)
        "#{type}_#{request_or_response(type)}"
      end

      def definition_name(action, request_or_response)
        type_method(type_from_action(action, request_or_response))
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
