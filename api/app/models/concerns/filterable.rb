# frozen_string_literal: true

# Conventions-based filtering concern that allows a model to define scopes matching a certain set of patterns
# to filter their results using both the database and searchkick for keyword search.
#
# @see Filtering::Apply
# @see Filtering::Applicator
# @see Filtering::Config
module Filterable
  extend ActiveSupport::Concern

  include LazyOrdering

  included do
    extend Dry::Core::ClassAttributes

    defines :filtering_config, type: Filtering::Types.Instance(Filtering::Config)

    filtering_config Filtering::Config.new(self)
  end

  module ClassMethods
    # @param [Hash] params
    # @param [ActiveRecord::Relation] scope
    # @param [User, nil] user
    # @return [Searchkick::Relation]
    # @return [ActiveRecord::Relation] with kaminari data from {.by_pagination}.
    def filtered(params, scope: all, user: nil, skip_pagination: false)
      ManifoldApi::Container["filtering.apply"].(params, scope: scope, user: user, skip_pagination: skip_pagination)
    end

    # @abstract
    # @return [ActiveRecord::Relation<Filterable>]
    def apply_filtering_loads
      all
    end

    # @param [Hash] options (@see Filtering::Config for options)
    # @return [void]
    def configure_filtering!(**options)
      filtering_config Filtering::Config.new(self, **options)
    end

    def filtering_recalculate_available_scopes!
      filtering_config.recalculate_available_scopes!
    rescue NameError
      # :nocov:
      # intentionally left blank, only occurs in CI
      # :nocov:
    end

    # @api private
    def singleton_method_added(name)
      super

      filtering_recalculate_available_scopes!
    end
  end
end
