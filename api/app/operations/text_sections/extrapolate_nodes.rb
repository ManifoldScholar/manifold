# frozen_string_literal: true

module TextSections
  # Extrapolate a {TextSection}'s `body_json` into a tree of {TextSectionNode}s.
  #
  # If the text section's `body_hash` changes, it will create a new tree,
  # without purging the tree based on the previous `body_hash`, in order
  # to preserve potentially orphaned nodes for selection.
  class ExtrapolateNodes
    include Dry::Monads[:do, :result]
    include QueryOperation
    include ManifoldApi::Deps[
      correct_intermediate_nodes: "text_sections.correct_intermediate_nodes",
    ]

    # Arel expression to match an intermediate tag.
    TAG_IS_INTERMEDIATE = Arel.sql("tag").then { |tag| tag.not_eq(nil).and(tag.in(::TextSectionNode::INTERMEDIATE_TAGS)) }.to_sql

    FIRST_PART = <<~SQL
    WITH RECURSIVE nodes(
      text_section_id, body_hash,
      node_root, node_path, path,
      node_indices, depth, node_index,
      node_type, tag,
      attributes,
      node_uuid, text_digest, content,
      node_extra,
      children,
      children_count
      ) AS (
      SELECT
        id AS text_section_id, body_hash,
        node_root, node_root, '{}'::text[],
        '{}'::int[] AS node_indices, 0 AS depth, NULL::bigint as node_index,
        body_json ->> 'node_type', body_json ->> 'tag' AS tag,
        body_json -> 'attributes' AS attributes,
        body_json ->> 'node_uuid' AS node_uuid, body_json ->> 'text_digest' AS text_digest, body_json ->> 'content' AS content,
        body_json - ARRAY['node_type', 'attributes', 'children', 'node_uuid', 'text_digest', 'content', 'tag'] AS node_extra,
        CASE jsonb_typeof(body_json -> 'children') WHEN 'array' THEN body_json -> 'children' ELSE NULL END AS children,
        CASE jsonb_typeof(body_json -> 'children') WHEN 'array' THEN jsonb_array_length(body_json -> 'children') ELSE 0 END AS children_count
        FROM text_sections
        WHERE
          body_json IS NOT NULL AND body_json <> 'null'::jsonb
    SQL

    SECOND_PART = <<~SQL
      UNION ALL
      SELECT
        text_section_id, body_hash,
        nodes.node_root, nodes.node_path || (c.index - 1)::text, nodes.path || ARRAY['children', (c.index - 1)::text] AS path,
        nodes.node_indices || (c.index - 1)::int AS node_indices, nodes.depth + 1 AS depth, c.index - 1 AS node_index,
        c.node ->> 'node_type' AS node_type, c.node ->> 'tag',
        c.node -> 'attributes' AS attributes,
        c.node ->> 'node_uuid', c.node ->> 'text_digest', c.node ->> 'content' AS content,
        CASE c.node ->> 'node_type'
        WHEN 'element' THEN c.node - ARRAY['node_type', 'attributes', 'children', 'node_uuid', 'text_digest', 'content', 'tag']
        WHEN 'comment' THEN NULL
        WHEN 'text' THEN NULL
        ELSE
          NULL
        END AS node_extra,
        CASE jsonb_typeof(c.node -> 'children') WHEN 'array' THEN c.node -> 'children' ELSE NULL END AS children,
        CASE jsonb_typeof(c.node -> 'children') WHEN 'array' THEN jsonb_array_length(c.node -> 'children') ELSE 0 END AS children_count
        FROM nodes
        LEFT JOIN LATERAL jsonb_array_elements(nodes.children) WITH ORDINALITY AS c(node, index) ON true
        WHERE nodes.children_count <> 0
    ), finalized AS (
      SELECT
        text_section_id, body_hash,
        node_root, node_path, path,
        node_indices, depth, node_index,
        node_type, tag,
        COALESCE(attributes, '{}'::jsonb) AS node_attributes,
        node_uuid, text_digest, content,
        COALESCE(node_extra, '{}'::jsonb) AS node_extra,
        COALESCE(children_count, 0) AS children_count,
        (#{TAG_IS_INTERMEDIATE}) AS intermediate,
        CURRENT_TIMESTAMP AS extrapolated_at
      FROM nodes
    )
    SQL

    FINAL_PART = <<~SQL
    INSERT INTO text_section_nodes (
      text_section_id, body_hash,
      node_root, node_path, path,
      node_indices, depth, node_index,
      node_type, tag,
      node_attributes,
      node_uuid, text_digest, content,
      node_extra,
      children_count,
      intermediate,
      extrapolated_at
    ) SELECT
      text_section_id, body_hash,
      node_root, node_path, path,
      node_indices, depth, node_index,
      node_type, tag,
      node_attributes,
      node_uuid, text_digest, content,
      node_extra,
      children_count,
      intermediate,
      extrapolated_at
      FROM finalized
    ON CONFLICT (node_path) DO UPDATE SET
      "text_section_id" = EXCLUDED."text_section_id",
      "body_hash" = EXCLUDED."body_hash",
      "node_root" = EXCLUDED."node_root",
      "path" = EXCLUDED."path",
      "node_indices" = EXCLUDED."node_indices",
      "depth" = EXCLUDED."depth",
      "node_index" = EXCLUDED."node_index",
      "node_type" = EXCLUDED."node_type",
      "tag" = EXCLUDED."tag",
      "node_attributes" = EXCLUDED."node_attributes",
      "node_uuid" = EXCLUDED."node_uuid",
      "text_digest" = EXCLUDED."text_digest",
      "content" = EXCLUDED."content",
      "node_extra" = EXCLUDED."node_extra",
      "children_count" = EXCLUDED."children_count",
      "intermediate" = EXCLUDED."intermediate",
      "extrapolated_at" = EXCLUDED."extrapolated_at",
      "updated_at" =
      CASE
      WHEN EXCLUDED."text_section_id" IS DISTINCT FROM text_section_nodes."text_section_id"
        OR
        EXCLUDED."body_hash" IS DISTINCT FROM text_section_nodes."body_hash"
        OR
        EXCLUDED."node_root" IS DISTINCT FROM text_section_nodes."node_root"
        OR
        EXCLUDED."path" IS DISTINCT FROM text_section_nodes."path"
        OR
        EXCLUDED."node_indices" IS DISTINCT FROM text_section_nodes."node_indices"
        OR
        EXCLUDED."depth" IS DISTINCT FROM text_section_nodes."depth"
        OR
        EXCLUDED."node_index" IS DISTINCT FROM text_section_nodes."node_index"
        OR
        EXCLUDED."node_type" IS DISTINCT FROM text_section_nodes."node_type"
        OR
        EXCLUDED."tag" IS DISTINCT FROM text_section_nodes."tag"
        OR
        EXCLUDED."node_attributes" IS DISTINCT FROM text_section_nodes."node_attributes"
        OR
        EXCLUDED."node_uuid" IS DISTINCT FROM text_section_nodes."node_uuid"
        OR
        EXCLUDED."text_digest" IS DISTINCT FROM text_section_nodes."text_digest"
        OR
        EXCLUDED."content" IS DISTINCT FROM text_section_nodes."content"
        OR
        EXCLUDED."node_extra" IS DISTINCT FROM text_section_nodes."node_extra"
        OR
        EXCLUDED."children_count" IS DISTINCT FROM text_section_nodes."children_count"
        OR
        EXCLUDED."intermediate" IS DISTINCT FROM text_section_nodes."intermediate"
        OR
        EXCLUDED."extrapolated_at" IS DISTINCT FROM text_section_nodes."extrapolated_at"
        THEN CURRENT_TIMESTAMP
      ELSE
        text_section_nodes.updated_at
      END
    SQL

    def call(**args)
      corrected = yield correct_intermediate_nodes.(**args)

      return Success(upserted: 0, corrected: corrected) if args[:text_section].present? && args[:text_section].body_json.blank?

      upserted = sql_update! FIRST_PART, interpolate(**args), SECOND_PART, FINAL_PART

      Success(upserted: upserted, corrected: corrected)
    end

    private

    def interpolate(text_section: nil, **)
      with_quoted_id_for text_section, <<~SQL
      AND text_sections.id = %s
      SQL
    end
  end
end
