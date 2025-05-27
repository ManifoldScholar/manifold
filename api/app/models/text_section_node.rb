# frozen_string_literal: true

# @see TextSections::ExtrapolateNodes
class TextSectionNode < ApplicationRecord
  include HasKeywordSearch

  MAX_HIT_COUNT = 100

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

  scope :current, -> { joins(:text_section).where(TextSection.arel_table[:body_hash].eq(arel_table[:body_hash])) }
  scope :orphaned, -> { joins(:text_section).where(TextSection.arel_table[:body_hash].not_eq(arel_table[:body_hash])) }

  scope :sans_search_indexed, -> { where(search_indexed: false) }

  has_many_readonly :text_section_node_links, -> { in_order }, inverse_of: :parent, foreign_key: :parent_id
  has_many_readonly :ancestor_links, -> { in_reverse_order }, class_name: "TextSectionNodeLink", inverse_of: :child, foreign_key: :child_id

  has_many :parents, -> { terminal }, through: :ancestor_links, source: :parent
  has_many :children, through: :text_section_node_links, source: :child

  has_keyword_search! against: :contained_content, using: {
    tsearch: {
      tsvector_column: :tsv_contained_content,
    },
  },
  order_within_rank: "node_indices DESC, id ASC"

  delegate :to_apply, to: :text_section_node_contained_content, allow_nil: true, prefix: :contained_content

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

  # @api private
  # @return [Hash]
  def to_hit
    {
      content: contained_content,
      content_highlighted: [pg_search_highlight],
      node_uuid: hit_uuid,
      position: pg_search_rank
    }
  end

  class << self
    # @param [String] keyword
    # @return [<Hash>]
    def hit_search_for(keyword)
      hit_filter = Search::HitFilter.new

      keyword_search(keyword)
        .with_pg_search_rank
        .with_pg_search_highlight
        .limit(MAX_HIT_COUNT)
        .each_with_object([]) do |node, hits|
          next unless hit_filter.allow?(node)

          hits << node.to_hit
        end
    end

    # @api private
    # @see TextSectionNodes::BackportSearchIndexJob
    # @return [void]
    def backport_search_index!
      ids = all.where_values_hash.fetch("id", [])

      raise "must be called in a batch relation" if ids.blank?

      tsn = arel_table.alias("pn")

      id_in_batch = tsn[:id].in(ids).to_sql

      connection.exec_update(<<~SQL)
      WITH contained AS (
        SELECT
          pn.id AS id,
          array_agg(cn.node_uuid ORDER BY cn.node_indices) FILTER (WHERE cn.node_uuid IS NOT NULL) AS contained_node_uuids,
          string_agg(cn.content, ' ' ORDER BY cn.node_indices) FILTER (WHERE cn.content IS NOT NULL AND cn.content ~ '[^[:space:]]+') AS contained_content
          FROM text_section_nodes pn
          INNER JOIN text_section_nodes cn ON pn.node_path @> cn.node_path
          WHERE
            #{id_in_batch}
          GROUP BY 1
      )
      UPDATE text_section_nodes tsn SET
        contained_node_uuids = COALESCE(c.contained_node_uuids, '{}'::text[]),
        contained_content = c.contained_content,
        search_indexed_at = CURRENT_TIMESTAMP,
        search_indexed = TRUE
      FROM contained c
      WHERE
        c.id = tsn.id
      ;
      SQL
    end
  end
end
