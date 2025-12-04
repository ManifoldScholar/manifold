# frozen_string_literal: true

module Filtering
  # @see Filterable
  # @see Filtering::Apply
  class Applicator
    include Dry::Initializer[undefined: false].define -> do
      param :raw_params, Filtering::Types::Params

      option :scope, Filtering::Types::Scope

      option :user, Filtering::Types::User.optional, optional: true

      option :skip_pagination, Filtering::Types::Bool.optional, default: proc { false }, as: :skip_pagination_option

      option :model, Filtering::Types::ModelKlass, default: proc { scope.model }
    end

    include ManifoldApi::Deps[
      maybe_scope_by_param: "filtering.maybe_scope_by_param",
    ]

    # @return [Filtering::Config]
    attr_reader :config

    # @return [ActiveSupport::HashWithIndifferentAccess]
    attr_reader :params

    # @return [ActiveRecord::Relation] with kaminari data from {.by_pagination}.
    attr_reader :results

    # @return [Boolean]
    attr_reader :skip_pagination

    # @return [ActiveRecord::Relation] with kaminari data from {.by_pagination}.
    def call
      set_up!

      filter_with_database!

      if should_apply_keyword_search?
        @ids = @filtered_scope.distinct.reorder(nil).pluck(:id)

        apply_keyword_search!
      elsif should_apply_pagination?
        @results = @filtered_scope.page(params[:page]).per(params[:per_page])
      else
        @results = @filtered_scope.all
      end

      return results
    end

    private

    def apply_keyword_search!
      @results = @filtered_scope.keyword_search(params[:keyword]).page(params[:page]).per(params[:per_page])

      return unless exceeds_total_pages?(@results)

      @results = @filtered_scope.keyword_search.page(results.total_pages).per(params[:per_page])
    end

    # @!group Steps

    # @return [void]
    def set_up!
      @config = model.filtering_config

      @params = normalize_params

      @skip_pagination = @params[:skip_pagination] || RequestStore[:skip_pagination] || skip_pagination_option
    end

    # This will filter the given scope by the provided hash of params,
    # and either prepare the
    # @return [void]
    def filter_with_database!
      @filtered_scope = filter_with_database.apply_filtering_loads
    end

    # @!endgroup

    # @!group Filtering Actions

    # @return [ActiveRecord::Relation]
    def filter_with_database
      maybe_apply_default_order do
        params.reduce scope do |query, (key, value)|
          apply_database_filter query, key, value
        end
      end
    end

    # @!endgroup

    # @!group Database Filtering

    # Try to filter by a single param.
    #
    # @see Filtering::MaybeScopeByParam
    # @param [ActiveRecord::Relation] query
    # @param [String] key
    # @param [Object] value
    # @return [ActiveRecord::Relation]
    def apply_database_filter(query, key, value)
      return query if config.blacklisted_param?(key)

      unless param_requires_user?(key)
        maybe_scope_by_param.(query, key, value)
      else
        if query.respond_to?(key)
          query.public_send(key, user)
        else
          query.all
        end
      end
    end

    # Match a certain pattern of param keys that conform to a scope on the
    # model that take the provided user as their argument.
    #
    # @param [String] key
    def param_requires_user?(key)
      key.start_with?("with_") && key.end_with?("_ability", "_role")
    end

    # @!endgroup

    # @!group Filtering

    # @return [ActiveRecord::Relation]
    def maybe_apply_default_order
      return yield unless should_apply_default_order?

      initial_order_values = scope.order_values

      final_scope = yield

      final_order_values = final_scope.order_values

      return final_scope unless initial_order_values == final_order_values

      config.apply_default_order!(final_scope)
    end

    def search_query
      params[:keyword].presence || "*"
    end

    def should_apply_keyword_search?
      return false unless params.key?(:keyword) && params[:keyword].present?
      return false if has_keyword_scope?
      return false unless @filtered_scope.exists?

      return true
    end

    def has_keyword_scope?
      scope.respond_to?(:by_keyword)
    end

    # @param [ActiveRecord::Relation] results
    def exceeds_total_pages?(results)
      return false unless paginated? results

      # No sense in re-running the ES query if we're already asking for the first page.
      return false if results.current_page == 1

      results.current_page > results.total_pages
    end

    def paginated?(results)
      results.respond_to?(:current_page) && results.total_pages.present?
    end

    def should_apply_default_order?
      config.should_apply_default_order?(params)
    end

    def should_apply_pagination?
      !skip_pagination && params[:page].present?
    end

    # @!endgroup

    def normalize_params
      raw_params.with_indifferent_access.reverse_merge(page: 1, per_page: model.default_per_page)
    end
  end
end
