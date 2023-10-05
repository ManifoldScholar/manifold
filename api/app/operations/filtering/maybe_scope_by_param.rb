# frozen_string_literal: true

module Filtering
  # Scope by parameter keys matching a certain pattern.
  #
  # @api private
  # @see Filtering::DatabaseScopeFor
  class MaybeScopeByParam
    extend Dry::Core::Cache

    include ManifoldApi::Deps[
      scopes_for: "filtering.find_param_scope",
    ]

    # @param [ActiveRecord::Relation] query
    # @param [#to_s] key
    # @param [Object] value
    # @return [ActiveRecord::Relation]
    def call(query, key, value)
      scopes = scopes_for.(query, key)

      if scopes.present?
        scopes.reduce(query) do |out, scope|
          out.public_send(scope, value)
        end
      else
        query.all
      end
    end
  end
end
