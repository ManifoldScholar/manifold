# frozen_string_literal: true

# Conventions-based filtering concern that allows a model to define scopes matching a certain set of patterns
# to filter their results using both the database and searchkick for keyword search.
#
# @see Filtering::Apply
# @see Filtering::Applicator
module Filterable
  extend ActiveSupport::Concern

  class_methods do
    # @param [Hash] params
    # @param [ActiveRecord::Relation] scope
    # @param [User, nil] user
    # @return [Searchkick::Relation]
    # @return [ActiveRecord::Relation] with kaminari data from {.by_pagination}.
    def filtered(params, scope: all, user: nil, skip_pagination: false)
      ManifoldApi::Container["filtering.apply"].(params, scope: scope, user: user, skip_pagination: skip_pagination)
    end
  end
end
