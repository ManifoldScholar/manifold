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
  # rubocop:enable Metrics/BlockLength
end
