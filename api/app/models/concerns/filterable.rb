module Filterable
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
  # rubocop:disable Metrics/AbcSize
  class_methods do
    def filter(params, scope: all)
      results = scope.filter_with_query(params)
                     .filter_with_elasticsearch(params)
      validate_paginated_results(params, results)
    end

    def filter_with_query(params)
      params.to_hash.inject all do |results, (key, value)|
        scopes = %I[by_#{key} with_#{key}]
        scopes.inject results do |query, scope|
          next query unless query.respond_to? scope
          query.send scope, value
        end
      end
    end

    def filter_with_elasticsearch(params)
      return by_pagination params[:page], params[:per_page] unless params.key? :keyword
      ids = pluck :id
      return none if ids.blank?
      search_query = params.dig :keyword || "*"
      filter = Search::FilterScope.new do |f|
        f.where :id, ids
        f.typeahead params[:typeahead], self::TYPEAHEAD_ATTRIBUTES
        f.paginate params[:page], params[:per_page]
      end
      lookup search_query, filter
    end

    def validate_paginated_results(params, results)
      return results unless exceeds_total_pages? results
      filter params.merge(page: results.total_pages), scope: results
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
