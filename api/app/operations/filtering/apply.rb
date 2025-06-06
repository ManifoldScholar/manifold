# frozen_string_literal: true

module Filtering
  # @see Filterable
  # @see Filtering::Applicator
  class Apply
    # @param [Hash] params
    # @param [ActiveRecord::Relation] scope
    # @param [User, nil] user
    # @param [Boolean] skip_pagination
    # @return [ActiveRecord::Relation] with kaminari data from {.by_pagination}.
    def call(raw_params, scope:, user:, model: scope.model, skip_pagination: false)
      Filtering::Applicator.new(raw_params, model: model, scope: scope, user: user, skip_pagination: skip_pagination).call
    end
  end
end
