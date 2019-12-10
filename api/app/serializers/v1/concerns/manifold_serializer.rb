module V1
  module Concerns
    module ManifoldSerializer
      extend ActiveSupport::Concern

      included do
        set_key_transform :camel_lower
        pluralize_type true
        make_meta

        def initialize(resource, options = {})
          super(resource, options)
          @params[:root] = self.class unless @params.key? :root
        end
      end

      # rubocop:disable Metrics/BlockLength
      class_methods do
        delegate :typed_has_one, to: :current_register
        delegate :typed_belongs_to, to: :current_register
        delegate :typed_has_many, to: :current_register
        delegate :typed_attribute, to: :current_register
        delegate :abilities, to: :current_register
        delegate :current_user_is_creator?, to: :current_register
        delegate :has_one_creator, to: :current_register
        delegate :metadata, to: :current_register

        def when_full
          @in_full_block = true
          yield
          @in_full_block = false
        end

        def make_meta
          meta_proc = proc { |resource, params|
            out = block_given? ? yield(resource, params) : {}
            unless partialable?
              out[:partial] = false
              next out
            end

            out[:partial] = !full?(params)
            camelize_hash(out)
          }
          meta(&meta_proc)
        end

        def inject_if!(options)
          options[:if] = proc do |object, params|
            if partialable? && options[:full]
              next false unless full?(params)
            end
            if options[:private]
              next false unless include_private_data?(object, params)
            end
            true
          end
        end

        def inject_if?(options)
          return true if options[:private]
          return true if partialable?

          false
        end

        def map_options(options)
          inject_if!(options) if inject_if?(options)
          # We could derive FJA options from our own options here.
          options
        end

        def map_relationship_options(options)
          # Injecting this option means we don't have to specify that every relationship
          # is plural in every relationship definition. A bit of a work-around to deal
          # with awkward FJA interfaces.
          options[:pluralize_type] = true
          options
        end

        def include_private_data?(object, params = {})
          return true if params[:include_private_data] == true
          return false unless authenticated?(params)

          object.updatable_by?(params[:current_user]) || calculate_current_user_is_creator?(object, params)
        end

        def full?(params)
          return true unless partialable?

          params.dig(:full) == true && params.dig(:root) == self
        end

        def partialable?
          @full_register.present?
        end

        def current_register
          @in_full_block ? full_register : register
        end

        def register
          @register ||= SerializerRegistry.new(self)
        end

        def full_register
          @full_register ||= SerializerRegistry.new(self, full: true)
        end

        def partial_only?
          full_register.blank?
        end

        def camelize_hash(hash)
          hash.deep_transform_keys { |key| key.to_s.camelize(:lower) }.symbolize_keys!
        end

        def authenticated?(params)
          params[:current_user].present?
        end

        def current_user_can_update?(object, params)
          return false unless params[:current_user]

          params[:current_user].can_update?(object)
        end

        def current_user_is_object_user?(object, params)
          return false unless params[:current_user]
          return false unless object.respond_to? :user

          object.user == params[:current_user]
        end

        def calculate_current_user_is_creator?(object, params)
          return false unless params[:current_user]
          return false unless object.respond_to? :creator

          object.creator == params[:current_user]
        end

        def calculate_abilities(object, params)
          object.serialized_abilities_for(params[:current_user])
        end
      end
      # rubocop:enable Metrics/BlockLength
    end
  end
end
