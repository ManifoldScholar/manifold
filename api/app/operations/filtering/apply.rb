# frozen_string_literal: true

module Filtering
  # @see Filterable
  # @see Filtering::Applicator
  class Apply
    # @param [Hash] params
    # @param [ActiveRecord::Relation] scope
    # @param [User, nil] user
    # @return [Searchkick::Relation]
    # @return [ActiveRecord::Relation] with kaminari data from {.by_pagination}.
    def call(raw_params, scope:, user:)
      Filtering::Applicator.new(raw_params, scope: scope, user: user).call
    end
  end
end
