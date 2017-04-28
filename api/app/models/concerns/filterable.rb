module Filterable
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
  class_methods do
    def filter(params, scope: all)
      use_elasticsearch = params.key?(:keyword)
      page, per_page = params.values_at(:page, :per_page)
      results = filter_with_query(params, scope: scope)
      results = filter_with_elasticsearch(params, results) if use_elasticsearch
      results = results.by_pagination(page, per_page) unless use_elasticsearch
      results = validate_paginated_results(params, results, scope)
      results
    end

    private

    def filter_with_query(params, scope: all)
      results = scope
      params.each do |key, value|
        by_method = "by_#{key}"
        with_method = "with_#{key}"
        if results.respond_to?(by_method)
          results = results.send(by_method, value)
        end
        if results.respond_to?(with_method)
          results = results.send(with_method, value)
        end
      end
      results
    end

    def filter_with_elasticsearch(params, query_scope = nil)
      ids = query_scope.nil? ? nil : query_scope.pluck(:id)
      search_query = params.dig(:keyword) || "*"
      filter = Search::FilterScope
               .new
               .where(:id, ids)
               .typeahead(params[:typeahead], self::TYPEAHEAD_ATTRIBUTES)
               .paginate(params[:page], params[:per_page])
      lookup(search_query, filter)
    end

    def validate_paginated_results(params, results, scope)
      return results unless exceeds_total_pages?(results)
      filter(params.merge(page: results.total_pages), scope: scope)
    end

    def paginated?(maybe_paginated)
      maybe_paginated.respond_to?(:current_page)
    end

    def exceeds_total_pages?(paginated)
      return false unless paginated?(paginated)
      return false if paginated.total_pages.zero?
      paginated.current_page > paginated.total_pages
    end
  end
  # rubocop:enable Metrics/BlockLength

  included do
    private_class_method :exceeds_total_pages?
    private_class_method :paginated?
    private_class_method :validate_paginated_results
    private_class_method :filter_with_elasticsearch
    private_class_method :filter_with_query

    scope :by_pagination, lambda { |page, per|
      return all unless page.present?
      page(page).per(per)
    }
  end
end
