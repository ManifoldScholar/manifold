module APIDocs
  module Helpers
    module Inflections
      def request_types
        [:create, :update]
      end

      def resource_klass(resource)
        klass = "APIDocs::Definitions::Resources::#{resource.to_s.camelize}".constantize
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

      def type_method(type)
        "#{type}_#{request_or_response(type)}"
      end
    end
  end
end
