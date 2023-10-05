# frozen_string_literal: true

module Filtering
  # This operation figures out which scopes a model actually supports
  # and caches them, since it won't change at runtime.
  #
  # @api private
  class FindParamScope
    extend Dry::Core::Cache

    # These are the acceptable patterns that a model can define to filter by a given param.
    #
    # It's possible that multiple patterns could be matched.
    #
    # The original logic would call both. We probably want to improve this at some point.
    PATTERNS = [
      "by_%<scope_key>s",
      "with_%<scope_key>s",
    ].freeze

    # These param keys should not be checked because they are used by other parts of filtering.
    RESERVED = %w[
      page
      per_page
    ].freeze

    # @param [Class<ActiveRecord::Base>] klass
    # @param [#to_s] key
    # @return [<Symbol>, nil]
    def call(klass, key)
      model_key = klass.model_name.to_s
      scope_key = key.to_s

      return nil if scope_key.in?(RESERVED)

      fetch_or_store model_key, scope_key do
        maybe_find_matching_scopes_for(klass, scope_key)
      end
    end

    private

    # @param [Class<ActiveRecord::Base>] klass
    # @param [String] scope_key
    # @return [<Symbol>]
    def maybe_find_matching_scopes_for(klass, scope_key)
      scopes = PATTERNS.map do |pat|
        scope = pat % { scope_key: scope_key }

        scope.to_sym
      end

      scopes.select do |scope|
        klass.respond_to?(scope)
      end.freeze
    end
  end
end
