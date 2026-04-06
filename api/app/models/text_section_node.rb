# frozen_string_literal: true

# @see TextSections::ExtrapolateNodes
class TextSectionNode < ApplicationRecord
  include HasKeywordSearch

  MAX_HIT_COUNT = 5

  # A list of HTML / MathML tags that should be treated as "intermediate".
  #
  # When figuring out the node to return for an annotation, intermediate nodes
  # are skipped over until they reach a parent that is not intermediate.
  #
  # @see TextSections::CorrectIntermediateNodes
  # @see TextSections::ExtrapolateNodes
  INTERMEDIATE_TAGS = %w[
    mrow
    mi
    msup
    mn
    mo
    thead
    tbody
    tfoot
    tr
    td
    th
  ].freeze

  belongs_to :text_section, inverse_of: :text_section_nodes

  scope :by_type, ->(type) { where(node_type: type) }
  scope :by_uuid, ->(uuid) { where(node_uuid: uuid) }
  scope :terminal, -> { where(intermediate: false) }
  scope :with_intermediate_tag, -> { where(tag: INTERMEDIATE_TAGS) }

  scope :current, -> { where(current: true) }
  scope :orphaned, -> { where(current: false) }

  scope :mismatched_current, -> { joins(:text_section).where(arel_mismatched_current) }

  scope :sans_search_indexed, -> { where(search_indexed: false) }

  has_many_readonly :text_section_node_links, -> { in_order }, inverse_of: :parent, primary_key: %i[text_section_id id], foreign_key: %i[text_section_id parent_id]
  has_many_readonly :ancestor_links, -> { in_reverse_order }, class_name: "TextSectionNodeLink", inverse_of: :child, primary_key: %i[text_section_id id], foreign_key: %i[text_section_id child_id]

  has_many :parents, -> { terminal }, through: :ancestor_links, source: :parent
  has_many :children, through: :text_section_node_links, source: :child

  has_keyword_search! against: :contained_content,
    order_within_rank: "node_indices DESC, id ASC",
    using: {
      trigram: {},
      tsearch: {
        tsvector_column: :tsv_contained_content,
      },
    }

  def node
    node_extra.with_indifferent_access.merge(
      slice(:node_type, :tag, :node_uuid, :text_digest, :content).compact
    ).merge(
      reconstructed: true,
      attributes: node_attributes
    ).compact
  end

  # @see AnnotationNode#body_json
  # @return [Hash]
  def reconstructed_node
    return node if children_count.zero?

    recon = node.merge(children: [])

    children.each_with_object(recon) do |child, n|
      indices = child.node_indices.drop(depth)

      target = indices.reduce(n) do |hsh, index|
        hsh[:children] ||= []

        hsh[:children][index] ||= {}.with_indifferent_access
      end

      target.merge!(child.node)
    end
  end

  def hit_uuid
    node_uuid || contained_node_uuids.first
  end

  # @note Override default behavior. Highlights don't perform well on large corpuses.
  def pg_search_highlight
    ""
  end

  # @api private
  # @see TextSectionNodes::IndexContainedContent
  # @return [void]
  def index_contained_content!
    ManifoldApi::Container["text_section_nodes.index_contained_content"].(self).value!
  end

  # @api private
  # @return [Hash]
  def to_hit
    {
      content: contained_content,
      content_highlighted: [content_highlighted],
      node_uuid: hit_uuid,
      position: pg_search_rank
    }
  end

  class << self
    # @param [String] keyword
    # @param [<String>] text_section_ids
    # @return [<Hash>]
    def hit_search_for(keyword, text_section_ids: [])
      # :nocov:
      return {} if text_section_ids.blank?
      # :nocov:

      query = build_hit_query_for(keyword, text_section_ids:)

      hit_filters = text_section_ids.index_with { Search::HitFilter.new }

      hit_results = text_section_ids.index_with { [] }.merge(nil => Dry::Core::Constants::EMPTY_ARRAY)

      TextSectionNode.find_by_sql(query).each_with_object(hit_results) do |node, hits|
        hit_filter = hit_filters.fetch(node.text_section_id)

        next unless hit_filter.allow?(node)

        hits[node.text_section_id] << node.to_hit
      end
    end

    # @api private
    # @return [String]
    def build_hit_query_for(keyword, text_section_ids:)
      ManifoldApi::Container["text_section_nodes.build_hits_query"].(keyword:, text_section_ids:).value!
    end

    # @api private
    # @return [Arel::Nodes::Inequality]
    def arel_mismatched_current
      text_sections = TextSection.arel_table
      text_section_nodes = TextSectionNode.arel_table

      body_hash_matches = arel_grouping(text_sections[:body_hash].eq(text_section_nodes[:body_hash]))
      current = text_section_nodes[:current]

      body_hash_matches.not_eq(current)
    end
  end
end
