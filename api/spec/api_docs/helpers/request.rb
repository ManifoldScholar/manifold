module APIDocs
  module Helpers
    class Request

      include Helpers::Inflections

      attr_accessor :action, :options

      def initialize(options, action)
        @options = options
        @action = action
      end

      def content_type
        "application/json"
      end

      def focus
        @options[:focus].present?
      end

      def requires_auth?
        @options[:authorized_user].present?
      end

      def response_body?
        options.key?(:response_body) ? @options[:response_body].present? : true
      end

      def paginated?
        options[:paginated].present?
      end

      def instantiate_before_test?
        return options[:instantiate_before_test].present? if options.key? :instantiate_before_test

        true
      end

      def authorized_user
        auth = @options[:authorized_user]
        raise "authorized_user requires inputs that can be converted to a string" unless auth.respond_to?(:to_s)

        auth.to_s
      end

      def article(type)
        return nil if type.nil?
        return "the" if ["current user", "settings", "statistics"].include? type
        return "a" if %w[user].include? type

        %w(a e i o u).include?(type[0].downcase) ? "an" : "a"
      end

      def possessivize(type)
        return nil if type.nil?

        type + (type[-1, 1] == "s" ? "'" : "'s")
      end

      def downcase_first(string)
        return nil if string.nil?

        string[0, 1].downcase + string[1..-1]
      end

      def transform_type(type)
        return "settings" if type.downcase == "setting"

        type.underscore.humanize.downcase
      end

      def string_vars(type)
        parent = downcase_first(@options[:parent])
        human_type = transform_type(type)
        @string_vars ||= {
          parent: parent,
          parent_possessive: possessivize(parent),
          parent_article: article(parent),
          type: human_type,
          article: article(human_type),
          attribute: "ID"
        }
      end

      def summary
        return @options[:summary] if @options[:summary]

        type = action == :index ? human_resource_name_plural : human_resource_name
        key = @options[:parent].present? ? "swagger.#{@action}.summary_with_parent" : "swagger.#{@action}.summary"
        I18n.t(key, string_vars(type))
      end

      def response_description?
        response_description.present?
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
        return options[:summary] if options.key? :summary

        type = human_resource_name
        I18n.t("swagger.#{@action}.success", type: type, article: article(type), attribute: "ID")
      end

      def success_response_code
        return @options[:success_response_code] if @options[:success_response_code]

        return "204" if action == :destroy
        return "201" if action == :create

        "200"
      end

      def model
        @options[:model]
      end

      def exclude_404
        @options[:exclude]&.include?("404")
      end

      def exclude_401
        !requires_auth? || @options[:exclude]&.include?("401")
      end

      def request_body?
        return options[:request_body] if options.key?(:request_body)
        return options[:parameters].any? { |hash| hash[:in] == :body } if options.key?(:parameters)

        true
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

      def request_id?
        return options[:request_id] if options.key?(:request_id)

        true
      end

      def delete_has_response_body?
        @options[:delete_has_response_body].present?
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

        defaults[@action] = remove_request_body(defaults[@action]) unless request_body?
        defaults[@action] = remove_request_id(defaults[@action]) unless request_id?
        defaults[@action] || []
      end

      def remove_request_body(defaults)
        defaults.reject { |parameter| parameter[:in] == :body }
      end

      def remove_request_id(defaults)
        defaults.reject { |parameter| parameter[:name] == :id }
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
        options = {
          paginated: paginated?
        }
        resource_klass(resource_name).send(type_method(type_from_action(action, :response)), options)
      end
    end
  end
end
