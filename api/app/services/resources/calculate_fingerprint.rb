module Resources
  # Calculate a fingerprint for a {Resource}.
  class CalculateFingerprint < ActiveInteraction::Base
    include FingerprintInteraction

    record :resource

    # Presentational and other columns which should not factor into
    # fingerprint calculation
    # @api private
    EXCLUDED_COLUMNS = %w[
      allow_high_res
      allow_download
      doi_requested
      doi_added
      iframe_allow_fullscreen
      minimum_height
      minimum_width
      pending_sort_title
      sort_title
    ].freeze

    # @api private
    COLUMNS = Resource.column_names
      .grep_v(/_(?:id|at|deprecated|count|data)\z/)
      .without(*EXCLUDED_COLUMNS)
      .map(&:to_sym)
      .freeze

    # @api private
    ATTACHMENTS = Resource.column_names.grep(/_data\z/).map do |column|
      column.sub(/_data\z/, "_checksum").to_sym
    end.freeze

    def add_details!
      update_digest_with! resource, *COLUMNS, *ATTACHMENTS
    end
  end
end
