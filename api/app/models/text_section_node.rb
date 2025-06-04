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

  scope :current, -> { joins(:text_section).where(TextSection.arel_table[:body_hash].eq(arel_table[:body_hash])) }
  scope :orphaned, -> { joins(:text_section).where(TextSection.arel_table[:body_hash].not_eq(arel_table[:body_hash])) }

  scope :sans_search_indexed, -> { where(search_indexed: false) }

  has_many_readonly :text_section_node_links, -> { in_order }, inverse_of: :parent, foreign_key: :parent_id
  has_many_readonly :ancestor_links, -> { in_reverse_order }, class_name: "TextSectionNodeLink", inverse_of: :child, foreign_key: :child_id

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

  # @note Override default behavior. Highlights don't perform well on large corpuses.
  def pg_search_highlight
    ""
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
      return {} if text_section_ids.blank?

      query = build_hit_query_for(keyword, text_section_ids:)

      hit_filters = text_section_ids.index_with { Search::HitFilter.new }

      hit_results = text_section_ids.index_with { [] }.merge(nil => Dry::Core::Constants::EMPTY_ARRAY)

      query.each_with_object(hit_results) do |node, hits|
        hit_filter = hit_filters.fetch(node.text_section_id)

        next unless hit_filter.allow?(node)

        hits[node.text_section_id] << node.to_hit
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
        contained_content = CASE WHEN char_length(c.contained_content) <= 4096 THEN c.contained_content ELSE '' END,
        search_indexed_at = CURRENT_TIMESTAMP,
        search_indexed = TRUE
      FROM contained c
      WHERE
        c.id = tsn.id
      ;
      SQL
    end

    private

    def arel_content_highlighted_for(keyword, node_hits:)
      q = unscoped.keyword_search(keyword)

      tsearch = q.__send__(:tsearch)

      Arel::Nodes::NamedFunction.new(
        "ts_headline",
        [
          tsearch.__send__(:dictionary),
          node_hits[:contained_content],
          tsearch.__send__(:arel_wrap, tsearch.__send__(:tsquery)),
          Arel::Nodes.build_quoted(tsearch.__send__(:ts_headline_options))
        ]
      )
    end

    # @param [String] keyword
    # @param [<String>] text_section_ids
    # @return [ActiveRecord::Relation<TextSectionNode>]
    def build_hit_query_for(keyword, text_section_ids:)
      inner_query = build_hit_inner_query_for(keyword, text_section_ids:)

      node_hits = Arel::Table.new("node_hits")

      TextSectionNode.from(inner_query.to_sql, "node_hits")
        .reselect(?*)
        .select(arel_content_highlighted_for(keyword, node_hits:).as("content_highlighted"))
        .where(node_hits[:hit_number].lteq(MAX_HIT_COUNT))
        .order(node_hits[:text_section_id].asc)
        .order(node_hits[:pg_search_rank].desc)
        .order(node_hits[:hit_number].asc)
    end

    # @param [String] keyword
    # @param [<String>] text_section_ids
    # @return [Arel::Nodes::Grouping]
    def build_hit_inner_query_for(keyword, text_section_ids:)
      base_query = all
        .keyword_search(keyword)
        .current
        .where(text_section_id: text_section_ids)
        .with_pg_search_rank

      hit_number = hit_number_for(base_query)

      hit_inner_query = base_query.select(hit_number.as("hit_number")).to_sql

      in_text_sections = arel_table[:text_section_id].in(text_section_ids).to_sql

      # We need to move this condition inside the pg_search subquery
      # or else we fetch way too much
      hit_inner_query = hit_inner_query.sub(
        /(WHERE\s+)(.+?)(\) AS #{base_query.pg_search_rank_table_alias} ON)/i,
        %[\\1 #{in_text_sections} AND (\\2)\\3]
      )

      arel_grouping(
        arel_literal(
          hit_inner_query
        )
      ).as("node_hits")
    end

    # @param [ActiveRecord::Relation<TextSectionNode>] query
    # @return [Arel::Nodes::NamedFunction]
    def hit_number_for(query)
      window = search_window_for query

      arel_named_fn("row_number").over(window)
    end

    # @param [ActiveRecord::Relation<TextSectionNode>] query
    # @return [Arel::Nodes::Window]
    def search_window_for(query)
      rank_table = Arel::Table.new(query.pg_search_rank_table_alias)

      Arel::Nodes::Window.new
        .partition(arel_table[:text_section_id])
        .order(rank_table[:rank].desc)
        .order(arel_table[:node_indices].desc)
        .order(arel_table[:id].asc)
    end
  end
end
