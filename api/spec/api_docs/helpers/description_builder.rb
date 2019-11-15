module ApiDocs
  module Helpers
    module DescriptionBuilder
      def get_class_definition(key)
        klass = resource_klass(resource_name)
        return klass.const_get(key) if klass.const_defined?(key)
        nil
      end

      def included
        @options[:included]
      end

      def description
        @options[:description]
      end

      def summary
        return @options[:summary] if @options[:summary]

        return I18n.t("swagger.#{@action}.description", type: human_resource_name_plural, attribute: "ID") if @action == :index
        I18n.t("swagger.#{@action}.description", type: human_resource_name, attribute: "ID")
      end

      def response_description?
        !!response_description
      end

      def response_description
        description || body_response_description
      end

      def success_description
        return @options[:success_description] if @options[:success_description]

        return I18n.t("swagger.#{@action}.success", type: human_resource_name, attribute: "ID") if @action == :index
        I18n.t("swagger.#{@action}.success", type: human_resource_name, attribute: "ID")
      end

      def human_resource_name
        resource_name.camelize
      end

      def human_resource_name_plural
        human_resource_name.pluralize
      end

      def body_request_description
        klass = resource_klass(resource_name)
        return "" unless klass.const_defined?(:BODY_REQUEST_DESCRIPTION)

        klass.const_get(:BODY_REQUEST_DESCRIPTION)
      end

      def body_response_description
        return "" if description_components.nil?
        description_components.join("\n")
      end

      private

      def validate_included_description!
        relationships = get_class_definition(:RELATIONSHIPS)
        included.each do |inclusion|
          next if relationships.has_key?(inclusion.is_a?(Symbol) ? inclusion : inclusion.to_sym)
          raise "Error: included key #{inclusion} does not exist in relationships for definition"
        end
      end

      def valid_included_description
        return unless included_description?
        validate_included_description!
        <<~HEREDOC
          Inclusion of related resources:
          #{included.map { |inclusion| "* #{inclusion.to_s.pluralize}" }.join("\n")}
        HEREDOC
      end

      def included_description?
        return false unless included.present?
        included.respond_to? :map
      end

      def description_components
        parts = []
        parts << get_class_definition(:BODY_RESPONSE_DESCRIPTION) if body_response_description?
        parts << valid_included_description if included_description?
      end

      def body_response_description?
        get_class_definition(:BODY_RESPONSE_DESCRIPTION).present?
      end
    end
  end
end
