require "uber/inheritable_attr"

module API
  module V1
    # Makes a controller resourceful.
    module Resourceful
      extend ActiveSupport::Concern

      ARRAY_OF_MODELS = lambda do |object|
        object.respond_to?(:first) && object.first.is_a?(ActiveRecord::Base)
      end

      included do
        authority_actions relationships: "read"

        extend Uber::InheritableAttr

        inheritable_attr :resource_configuration, clone: false
        inheritable_attr :model_klass,            clone: false
        inheritable_attr :model_serializer,       clone: false
        inheritable_attr :error_serializer,       clone: false

        delegate :resource_configuration, :model_serializer, :error_serializer,
                 :model_klass, to: :class
      end

      # Try to destroy the model. If this fails for some reason, render an error.
      #
      # @param [ActiveRecord::Base] model
      # @return [void]
      def render_destruction_of(model)
        if model.destroy
          head :no_content
        else
          render_single_resource(model)
        end
      end

      # @param [ActiveRecord::Relation, <ActiveRecord::Base>] models
      # @param [Hash] options
      # @return [void]
      def render_multiple_resources(models, **options)
        options[:each_serializer] ||= model_serializer
        options[:location]        ||= build_location_for(models)
        options[:json] = models
        options[:full] = false
        render_jsonapi models, options
      end

      # @param [ActiveRecord::Base] model
      # @param [Symbol] ok_status
      # @param [Symbol] error_status
      # @param [Hash] options
      # @return [void]
      def render_single_resource(model, ok_status: default_ok_status, error_status: :unprocessable_entity, **options)
        options[:serializer] ||= model_serializer
        options[:serializer] = error_serializer if (action_name == "update" || action_name == "create") && !model.valid?(options[:context])
        options[:location] ||= build_location_for model
        options[:status] ||= build_status_for model, ok_status, error_status, options[:context]
        options[:full] = true
        render_jsonapi model, options
      end

      # We want to make sure all our endpoints are authorized while we are in development.
      #
      # @api private
      def auditing_security?
        !Rails.env.production?
      end

      # @api private
      # @param [ActiveRecord::Base] model
      # @param [Symbol] ok
      # @param [Symbol] error
      # @return [Symbol]
      def build_status_for(model, ok, error, _context)
        return ok unless action_name == "update" || action_name == "create"

        model.errors.none? ? ok : error
      end

      # @api private
      # @param [ActiveRecord::Base] model
      # @return [Array]
      def build_location_for(model)
        case model
        when ActiveRecord::Relation
          [:api, :v1, model.model_name.route_key]
        when ARRAY_OF_MODELS
          [:api, :v1, model.first.model_name.route_key]
        when ActiveRecord::Base
          [:api, :v1, model]
        end
      end

      # @api private
      # @return [:created, :ok, Symbol]
      def default_ok_status
        if action_name == "create"
          :created
        else
          :ok
        end
      end

      # rubocop:disable Metrics/MethodLength
      class_methods do
        def setup_resources!(model:, authorize: true, authorize_options: {}, &model_scope)
          self.resource_configuration = API::V1::ResourcefulMethods.new(
            model: model,
            model_scope: model_scope
          )

          include resource_configuration

          if authorize
            ActiveSupport::Deprecation.silence do
              # Authority still uses `after_filter`. This check only occurs in dev & test
              # by default.
              performed_options = authorize_options.deep_dup
              performed_options[:if] ||= :auditing_security?

              ensure_authorization_performed performed_options
            end

            authorize_actions_for resource_configuration.model, authorize_options
          end

          self.model_klass      = resource_configuration.model
          self.model_serializer = detect_model_serializer
          self.error_serializer = ::V1::ErrorSerializer
        end

        # @return [String]
        def detect_model_name
          if model_klass.present?
            model_klass.model_name.to_s
          else
            name.demodulize.gsub(/Controller$/, "").singularize
          end
        end

        def detect_model_klass
          detect_model_name.safe_constantize
        end

        def detect_model_serializer
          "::V1::#{detect_model_name}Serializer".safe_constantize
        end
      end
      # rubocop:enable Metrics/MethodLength
    end
  end
end
