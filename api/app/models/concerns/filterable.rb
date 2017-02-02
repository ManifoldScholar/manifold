module Filterable
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
  class_methods do
    def filter(params)
      results = params.key?(:keyword) ? search(params) : query(params)
      if exceeds_total_pages?(results)
        params[:page] = results.total_pages
        return filter(params)
      end
      results
    end
  end
  # rubocop:enable Metrics/BlockLength
end
