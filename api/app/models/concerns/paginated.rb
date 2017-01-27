# Model concern that includes pagination scope
module Paginated
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
  included do
    scope :by_pagination, lambda { |page, per|
      return all unless page.present?
      page(page).per(per)
    }
  end

  class_methods do
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
end
