class ImportSelectionMatch < ApplicationRecord
  belongs_to :import_selection, counter_cache: :matches_count
  belongs_to :text_section
  belongs_to :searchable_node, optional: true

  delegate :body, to: :import_selection, prefix: :selection
  delegate :content, to: :searchable_node, prefix: :node
  delegate :node_uuid, to: :searchable_node

  alias start_node node_uuid
  alias end_node node_uuid

  scope :sans_range, -> { where(start_char: nil) }
  scope :with_range, -> { where.not(start_char: nil, end_char: nil) }
  def has_range?
    start_char? && end_char?
  end

  def match_range!
    ExternalImport::MatchRange.run! import_selection_match: self
  end

  # @return [String, nil]
  def selection
    node_content[to_range] if has_range?
  end

  def to_annotation_attributes
    slice(:start_char, :end_char, :start_node, :end_node, :selection, :text_section)
  end

  def to_range
    start_char..end_char if has_range?
  end
end
