module API
  module V1
    # Adds resourceful methods to a controller
    class ResourcefulMethods < Module
      # @!attribute [r] model
      # @return [ActiveRecord::Base]
      attr_reader :model

      # @!attribute [r] model_name
      # @return [ActiveModel::Name]
      attr_reader :model_name

      # @!attribute [r] model_scope
      # @return [Proc]
      attr_reader :model_scope

      attr_reader :collection_name, :resource_name

      # @!attribute [r] method_names
      # @return [Hash{Symbol => Symbol}]
      attr_reader :method_names

      def initialize(model:, model_scope: nil)
        @model        = model
        @model_name   = model.model_name
        @model_scope  = model_scope

        @resource_name    = model_name.singular_route_key.to_sym
        @collection_name  = model_name.route_key.to_sym

        @method_names = build_method_names

        define_methods!
      end

      def inspect
        "API::V1::ResourcefulMethods(#{model_name})"
      end

      # @param [ApplicationController] controller
      # @return [ActiveRecord::Relation]
      def load_resources_for(controller)
        if model_scope.respond_to?(:call)
          controller.present? ? controller.instance_eval(&model_scope) : model_scope.call
        else
          model.all
        end
      end

      def method_for(method_name)
        method_names.fetch(method_name) do
          raise ArgumentError, "Could not find named resource method for #{method_name}"
        end
      end

      private

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Lint/UnderscorePrefixedVariableName
      def define_methods!
        _resource_configuration = self

        define_method(:resource_configuration) { _resource_configuration }

        define_method(:call_resourceful_method) do |method_name|
          __send__(resource_configuration.method_for(method_name))
        end

        class_eval <<-RUBY, __FILE__, __LINE__ + 1
        def #{method_names[:load_resources]}
          scope = apply_scopes(resource_configuration.load_resources_for(self))
          return scope.all if scope.respond_to? :all
          return scope
        end

        def #{method_names[:resource_scope]}
          @#{method_names[:resource_scope]} ||= load_resources
        end

        def #{method_names[:load_resource]}
          #{method_names[:resource_scope]}.find(#{method_names[:resource_id]})
        end

        def #{method_names[:load_and_authorize_resource]}
          #{method_names[:load_resource]}.tap do |resource|
            authorize_action_for resource
          end
        end

        def #{method_names[:authorize_and_create_resource]}(params, updater = ::Updaters::Default, assign_before_auth: [])
          build_param_keys = Array(assign_before_auth).map(&:to_sym)

          build_params = Hash(params.dig(:data, :attributes)&.slice(*build_param_keys))

          #{method_names[:resource_scope]}.build(build_params).tap do |resource|
            authorize_action_for resource
            resource.creator = current_user if resource.respond_to?(:creator=)
            updater.new(params).update(resource)
          end
        end

        def #{method_names[:resource_id]}
          params.fetch(:id, params[:#{resource_name}_id])
        end

        def load_resources
          #{method_names[:load_resources]}
        end

        def load_resource
          #{method_names[:load_resource]}
        end

        def load_and_authorize_resource
          #{method_names[:load_and_authorize_resource]}
        end

        def resource_id_from_params
          #{method_names[:resource_id]}
        end
        RUBY
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Lint/UnderscorePrefixedVariableName

      def build_method_names
        the_name = resource_name == :resource ? :zresource : resource_name
        the_collection_name = collection_name == :resources ? :zresources : collection_name

        {}.tap do |method_names|
          method_names[:resource_id]                  = :"#{the_name}_id_from_params"
          method_names[:load_resources]               = :"load_#{the_collection_name}"
          method_names[:load_resource]                = :"load_#{the_name}"
          method_names[:load_and_authorize_resource]  = :"load_and_authorize_#{the_name}"
          method_names[:authorize_and_create_resource] = :"authorize_and_create_#{the_name}"
          method_names[:resource_scope] = :"scope_for_#{the_collection_name}"
        end
      end

    end
  end
end
