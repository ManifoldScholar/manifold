# frozen_string_literal: true

module Filtering
  # @see Filterable
  # @see Filtering::Apply
  class Applicator
    extend ActiveModel::Callbacks

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

    define_model_callbacks :database_filters

    # @return [Filtering::Config]
    attr_reader :config

    # @return [ActiveSupport::HashWithIndifferentAccess]
    attr_reader :params

    # @return [Searchkick::Relation]
    # @return [ActiveRecord::Relation] with kaminari data from {.by_pagination}.
    attr_reader :results

    # @return [Boolean]
    attr_reader :skip_pagination

    # @return [Searchkick::Relation]
    # @return [ActiveRecord::Relation] with kaminari data from {.by_pagination}.
    def call
      set_up!

      filter_with_database!

      if should_apply_pagination?
        @results = @filtered_scope.page(params[:page]).per(params[:per_page])
      else
        @results = @filtered_scope.all
      end

      return results
    end

    private

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

    # @!group Filtering Actions

    # @return [ActiveRecord::Relation]
    def filter_with_database
      run_callbacks :database_filters do
        apply_database_filters
      end
    end

    # @!group Database Filtering

    # @return [ActiveRecord::Relation]
    def apply_database_filters
      maybe_apply_default_order do
        params.reduce scope do |query, (key, value)|
          apply_database_filter query, key, value
        end
      end
    end

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
    # @param [String] , elasticsearch: true     def param_requires_user?(key)
      key.start_with?("with_") && key.end_with?("_ability", "_role")
    end

    # @!endgroup

    # @return [ActiveRecord::Relation]
    def maybe_apply_default_order
      return yield unless should_apply_default_order?

      initial_order_values = scope.order_values

      final_scope = yield

      final_order_values = final_scope.order_values

      return final_scope unless initial_order_values == final_order_values

      config.apply_default_order!(final_scope)
    end

    # Newer versions of Searchkick require that the current_scope be nil.
    # Since we call this in a concern that is called from a scope, current_scope
    # is always set even if we do `ActiveRecord::Relation#model`. This remedies that
    # in a thread-safe way to ensure that we don't mangle the scope for any later
    # consumers.
    #
    # @return [void]
    def nullify_current_scope!
      old_scope = model.current_scope

      model.current_scope = nil

      yield
    ensure
      model.current_scope = old_scope
    end

    def search_query
      params[:keyword].presence || "*"
    end

    def should_apply_default_order?
      config.should_apply_default_order?(params)
    end

    def should_apply_pagination?
      !skip_pagination && params[:page].present?
    end

    # @!endgroup

    # @param [Searchkick::Relation] results
    def exceeds_total_pages?(results)
      return false unless paginated? results

      # No sense in re-running the ES query if we're already asking for the first page.
      return false if results.current_page == 1

      results.current_page > results.total_pages
    end

    # Certain models do not use Elasticsearch for keyword searching, e.g. {Entitlement}s and {ReadingGroup}s.
    # In these cases, we want to skip calling out to searchkick.
    def has_keyword_scope?
      scope.respond_to?(:by_keyword)
    end

    def normalize_params
      raw_params.with_indifferent_access.reverse_merge(page: 1, per_page: model.default_per_page)
    end

    # @param [ActiveRecord::Relation, Searchkick::Relation] results
    def paginated?(results)
      results.respond_to?(:current_page) && results.total_pages.present?
    end
  end
end
