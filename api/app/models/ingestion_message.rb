# frozen_string_literal: true

# A message stored during resource ingestion to be later returned to the client
class IngestionMessage < ApplicationRecord
  LOG_LEVELS = %w[unknown debug info warn error fatal].freeze

  LOG_LEVEL_ENUM = LOG_LEVELS.to_h { |level| [level, level] }.freeze

  enum :severity, LOG_LEVEL_ENUM, suffix: :severity, allow_blank: false, default: "unknown"

  belongs_to :ingestion, inverse_of: :ingestion_messages

  scope :in_default_order, -> { reorder(created_at: :asc) }

  scope :logs, -> { where(kind: "log") }
  scope :log_message_matches, ->(needle) { logs.where(arel_log_message_matches(needle)) }

  before_validation :normalize_severity!

  validates :kind, :payload, presence: true

  private

  # @return [void]
  def normalize_severity!
    self.severity = severity.to_s.downcase.presence_in(LOG_LEVELS) || "unknown"
  end

  class << self
    # @param [String] needle
    # @return [Arel::Nodes::Matches]
    def arel_log_message_matches(needle)
      ingestion_messages = IngestionMessage.arel_table

      arel_named_fn("extract_ingestion_message_text", ingestion_messages[:payload]).matches(arel_quote(needle), nil, false)
    end
  end
end
