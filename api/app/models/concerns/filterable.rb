module Filterable
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
  # rubocop:disable Metrics/AbcSize
  class_methods do
    def filtered(params, scope: all, user: nil)
      results = scope.filter_with_query(params, user)
        .filter_with_elasticsearch(params)

      validate_paginated_results(params, results)
    end

    def filter_with_query(params, user = nil)
      params.to_hash.inject all do |results, (key, value)|
        key_s = key.to_s
        if scope_requires_user?(key_s)
          next results unless results.respond_to? key

          results.send key, user
        else
          scopes = %I[by_#{key_s} with_#{key_s}]
          scopes.inject results do |query, scope|
            next query unless query.respond_to? scope

            query.send scope, value
          end
        end
      end
    end

    def filter_with_elasticsearch(params)
      ids = distinct.reorder(nil).pluck :id
      return by_pagination(params[:page], params[:per_page]) if !params.key?(:keyword) || ids.blank? || respond_to?(:by_keyword)

      search_query = params.dig :keyword || "*"
      filter = Search::FilterScope.new do |f|
        f.where :id, ids
        f.typeahead params[:typeahead], self::TYPEAHEAD_ATTRIBUTES
        f.paginate params[:page], params[:per_page]
      end
      lookup search_query, filter
    end

    def scope_requires_user?(key)
      key.start_with?("with_") && key.end_with?("_ability", "_role")
    end

    def validate_paginated_results(params, results)
      return results unless exceeds_total_pages? results

      filtered params.merge(page: results.total_pages), scope: results
    end

    def paginated?(results)
      results.respond_to?(:current_page) && results.total_pages.positive?
    end

    def exceeds_total_pages?(results)
      return false unless paginated? results

      results.current_page > results.total_pages
    end
  end
  # rubocop:enable Metrics/BlockLength
  # rubocop:enable Metrics/AbcSize

  included do
    scope :by_pagination, lambda { |page_number, per_page|
      page(page_number).per(per_page) if page_number.present?
    }
  end
end
