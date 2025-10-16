# frozen_string_literal: true

module TextSections
  # A batch version of {TextSectionNodes::IndexContainedContent},
  # included for troubleshooting and possible future use.
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
        WHERE
        pn.text_section_id = %<text_section_id>s
        AND
        pn.body_hash = %<body_hash>s
        GROUP BY pn.id
    )
    UPDATE text_section_nodes tsn SET
      contained_node_uuids = COALESCE(d.contained_node_uuids, '{}'::text[]),
      contained_content = CASE WHEN char_length(d.contained_content) <= 4096 THEN d.contained_content ELSE '' END,
      search_indexed = TRUE
      FROM derived d
      WHERE tsn.id = d.text_section_node_id
    ;
    SQL

    # @param [TextSection] text_section
    # @return [Dry::Monads::Result]
    def call(text_section)
      params = {
        text_section_id: text_section.quoted_id,
        body_hash: text_section.body_hash,
      }

      query = QUERY % params

      response = sql_update!(query)

      Success response
    end
  end
end
