# frozen_string_literal: true

module TextSectionNodes
  # Index the contained content for a {TextSectionNode}.
  # This needs to happen this way rather than during node extrapolation
  # owing to the expensiveness of the query that figures out what each
  # node contains. Postgres isn't able to take advantage of indexing on
  # the generated ltrees that represent node paths, so it is actually
  # several orders of magnitude faster to do this for each node in
  # a separate query.
  class IndexContainedContent
    include Dry::Monads[:do, :result]
    include QueryOperation

    QUERY = <<~SQL
    WITH derived AS (
      SELECT pn.id AS text_section_node_id,
        COALESCE(array_agg(cn.node_uuid ORDER BY cn.node_indices) FILTER (WHERE cn.node_uuid IS NOT NULL), '{}'::text[]) AS contained_node_uuids,
        string_agg(cn.content, ' ' ORDER BY cn.node_indices) FILTER (WHERE cn.content IS NOT NULL AND cn.content ~ '[^[:space:]]+') AS contained_content
        FROM text_section_nodes pn
        INNER JOIN text_section_nodes cn ON cn.text_section_id = %<text_section_id>s AND cn.body_hash = %<body_hash>s AND pn.node_path @> cn.node_path
        WHERE pn.id = %<text_section_node_id>s
        GROUP BY pn.id
    )
    UPDATE text_section_nodes tsn SET
      contained_node_uuids = COALESCE(d.contained_node_uuids, '{}'::text[]),
      contained_content = CASE WHEN char_length(d.contained_content) <= 4096 THEN d.contained_content ELSE '' END,
      search_indexed = TRUE
      FROM derived d
      WHERE tsn.id = %<text_section_node_id>s
    ;
    SQL

    # @param [TextSectionNode] text_section_node
    # @return [Dry::Monads::Result]
    def call(text_section_node)
      params = {
        text_section_node_id: text_section_node.quoted_id,
        text_section_id: quote_value(text_section_node.text_section_id),
        body_hash: text_section_node.body_hash,
      }

      query = QUERY % params

      response = sql_update!(query)

      Success response
    end
  end
end
