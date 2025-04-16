# frozen_string_literal: true

module Filtering
  # Per-model configuration for models that implement {Filterable}.
  class Config
    include Dry::Core::Memoizable
    include Dry::Initializer[undefined: false].define -> do
      param :model, Filtering::Types::ModelKlass

      option :default_order_scope_name, Filtering::Types::Symbol, default: proc { :in_default_order }
      option :order_param_name, Filtering::Types::Coercible::String, default: proc { "order" }
      option :order_scope_name, Filtering::Types::Symbol, default: proc { :with_order }
    end

    SCOPE_PATTERN = /\A(?:by|with)_(?<param_name>.+)$/

    EXCLUDED_SCOPES = %i[
      by_cached_role
      by_permitted_user
      with_advisory_lock
      with_advisory_lock_result
      with_all_roles
      with_any_roles
      with_citable_children
      with_citation
      with_metadata
      with_options
      with_parsed_name
      with_role
      with_roles
    ].freeze

    PARAM_BLACKLIST = EXCLUDED_SCOPES.map { |scope| scope[SCOPE_PATTERN, :param_name] }.freeze

    # @return [ActiveSupport::HashWithIndifferentAccess]
    attr_reader :available_params

    # @return [<Symbol>]
    attr_reader :available_scopes

    def initialize(...)
      super

      recalculate_available_scopes!
    end

    # @param [ActiveRecord::Relation] scope
    # @return [ActiveRecord::Relation]
    def apply_default_order!(scope)
      scope.__send__(default_order_scope_name)
    end

    # @param [{ String => Object }] params
    def applied_order?(params)
      order_param_name.in?(params)
    end

    # @param [#to_s] param_name
    def blacklisted_param?(param_name)
      param_name.to_s.in?(PARAM_BLACKLIST)
    end

    def can_apply_default_order?
      can_order? && has_default_order?
    end

    def can_order?
      model.respond_to? order_scope_name
    end

    def has_default_order?
      model.respond_to? default_order_scope_name
    end

    # @return [void]
    def recalculate_available_scopes!
      @available_scopes = calculate_available_scopes

      @available_params = available_scopes.index_by do |scope|
        scope[SCOPE_PATTERN, :param_name]
      end.with_indifferent_access
    end

    def should_apply_default_order?(params)
      can_apply_default_order? && !applied_order?(params)
    end

    private

    # @return [<Symbol>]
    def calculate_available_scopes
      model.methods.grep(SCOPE_PATTERN) - EXCLUDED_SCOPES
    end
  end
end
