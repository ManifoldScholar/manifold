module Projects
  # Calculate a fingerprint for a {Project}.
  class CalculateFingerprint < ActiveInteraction::Base
    include FingerprintInteraction

    fingerprint_target! :project

    # Presentational and other columns which should not factor into
    # fingerprint calculation
    # @api private
    EXCLUDED_COLUMNS = %w[
      avatar_color
      dark_mode
      download_call_to_action
      hide_activity
      sort_title

      fingerprint
      export_configuration
    ].freeze

    # @api private
    COLUMNS = Project.column_names
      .grep_v(/_(?:id|at|deprecated|count|data|in_cents|currency|call_to_action)\z/)
      .grep_v(/standalone/)
      .grep_v(/\Acached/)
      .without(*EXCLUDED_COLUMNS)
      .map(&:to_sym)
      .freeze

    # @api private
    ATTACHMENTS = Project.column_names.grep(/_data\z/).map do |column|
      column.sub(/_data\z/, "_checksum").to_sym
    end.freeze

    def add_details!
      update_digest_with! project, *COLUMNS, *ATTACHMENTS

      calculate_fingerprints_for! published_texts
      calculate_fingerprints_for! project.resources
    end

    private

    def published_texts
      if project.published_texts.loaded?
        project.published_texts
      elsif project.texts.loaded?
        project.texts.select(&:published?)
      else
        project.texts.published(true)
      end
    end
  end
end
