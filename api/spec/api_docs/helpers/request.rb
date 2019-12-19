module ApiDocs
  module Helpers
    class Request

      include Helpers::Inflections

      attr_accessor :action
      attr_accessor :options

      def initialize(options, action)
        @options = options
        @action = action
      end

      def content_type
        "application/json"
      end

      def focus
        !!@options[:focus]
      end

      def with_auth
        !!@options[:auth_type]
      end

      def auth_type
        @options[:auth_type]
      end

      def summary
        return @options[:summary] if @options[:summary]
        type = action == :index ? human_resource_name_plural : human_resource_name
        I18n.t("swagger.#{@action}.description", type: type, attribute: "ID")
      end

      def response_description?
        !!response_description
      end

      def response_description
        [included_relationships, description, body_response_description].join("\n\n")
      end

      def included_relationships
        included = @options[:included_relationships] || []
        return nil if included.empty?

        docs = "Included relationships:\n* "
        docs << included.join("\n* ")
      end

      def description
        @options[:description]
      end

      def success_description
        return @options[:success_description] if @options[:success_description]

        I18n.t("swagger.#{@action}.success", type: human_resource_name, attribute: "ID")
      end

      def model
        @options[:model]
      end

      def exclude_404
        @options[:exclude]&.include?("404")
      end

      def exclude_403
        !with_auth || (@options[:exclude]&.include?("403"))
      end

      def factory
        @options[:factory] || model.name.underscore
      end

      def resource_name
        @options[:resource_name] || model.name.underscore
      end

      def resource_name_plural
        @options[:resource_name_plural] || resource_name.pluralize
      end

      def resource_tag
        resource_name.pluralize.humanize.titleize
      end

      def human_resource_name_plural
        resource_name_plural.camelize
      end

      def human_resource_name
        resource_name.camelize
      end

      def tags
        @options[:tags] || resource_tag
      end

      def default_parameters
        return @options[:parameters] if @options.key?(:parameters)

        defaults = {
          create: default_create_parameters,
          update: default_update_parameters,
          destroy: default_destroy_parameters,
          show: default_show_parameters
        }
        defaults[@action] || []
      end

      def parameters
        merge_additional_parameters(merge_url_parameters(default_parameters))
      end

      def merge_url_parameters(parameters)
        return parameters unless @options.key?(:url_parameters)

        url_parameters = @options[:url_parameters].map do |name|
          { name: name, in: :path, type: :string }
        end
        parameters.reject { |p| @options[:url_parameters].include? p } + url_parameters
      end

      def merge_additional_parameters(parameters)
        return parameters unless @options.key?(:additional_parameters)

        keys = @options[:additional_parameters].map { |p| p[:name] }
        parameters.reject { |p| keys.include? p } + @options[:additional_parameters]
      end

      def default_destroy_parameters
        [
          { name: :id, in: :path, type: :string }
        ]
      end

      def default_show_parameters
        [
          { name: :id, in: :path, type: :string }
        ]
      end

      def default_create_parameters
        [
          { name: :body, description: body_request_description, in: :body, schema: request }
        ]
      end

      def default_update_parameters
        [
          { name: :id, in: :path, type: :string },
          { name: :body, in: :body, description: body_request_description, schema: request }
        ]
      end

      def body_request_description
        klass = resource_klass(resource_name)
        return "" unless klass.const_defined?(:BODY_REQUEST_DESCRIPTION)

        klass.const_get(:BODY_REQUEST_DESCRIPTION)
      end

      def body_response_description
        # TODO: Add in included_relationships information
        klass = resource_klass(resource_name)
        return nil unless klass.const_defined?(:BODY_RESPONSE_DESCRIPTION)

        klass.const_get(:BODY_RESPONSE_DESCRIPTION)
      end

      def request
        resource_klass(resource_name).send(type_method(type_from_action(action, :request)))
      end

      def response
        # TODO: Denote if response is paginated or not
        resource_klass(resource_name).send(type_method(type_from_action(action, :response)))
      end
    end
  end
end
