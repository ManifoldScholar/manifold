module ApiDocs
  module Helpers
    class Request

      include Helpers::Inflections
      include Helpers::DescriptionBuilder

      def content_type
        "application/json"
      end

      def initialize(options, action)
        @options = options
        @action = action
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

      def tags
        @options[:tags] || resource_tag
      end

      def url_params; end

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

      def request
        resource_klass(resource_name).send(definition_name(@action, :request))
      end

      def response
        resource_klass(resource_name).send(definition_name(@action, :response))
      end
    end
  end
end
