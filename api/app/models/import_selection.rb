# rubocop:disable Style/NumericPredicate
class ImportSelection < ApplicationRecord
  has_many :import_selection_matches, dependent: :destroy, counter_cache: :matches_count

  scope :has_comments, ->(at_least = 1) { where(arel_json_array_gteq(:comments, at_least)) }
  scope :has_one_match, -> { where(arel_table[:matches_count].eq(1)) }
  scope :imported, -> { where.not imported_at: nil }
  scope :multiple_matches, ->(min = 1) { where arel_table[:matches_count].gt(min) }
  scope :pending, -> { where imported_at: nil }
  scope :should_be_matched, -> { sufficiently_long_body.unmatched }
  scope :successfully_matched, -> { has_one_match.with_ranged_matches }
  scope :sufficiently_long_body, -> { where(arel_table[:body].gt(10)) }
  scope :unmatched, -> { where arel_table[:matches_count].eq(0) }
  scope :unmatched_with_comments, -> { unmatched.has_comments }
  scope :with_ranged_matches, -> { where(id: ImportSelectionMatch.distinct.with_range.select(:import_selection_id)) }

  validates :body, presence: true

  def already_matched?
    matches_count > 0
  end

  def create_annotations!
    ExternalImport::CreateAnnotations.run import_selection: self
  end

  def match_selection!(reset_matches: false)
    ExternalImport::MatchSelection.run import_selection: self,
      reset_matches: reset_matches
  end

  def short_body?
    body.length <= 10
  end

  class << self
    def unmatched_stats
      comment_length    = arel_named_fn("jsonb_array_length", arel_table[:comments])
      highlight_length  = arel_named_fn("jsonb_array_length", arel_table[:highlights])

      unmatched.pluck :id, comment_length, highlight_length
    end
  end
end

# rubocop:enable Style/NumericPredicate
