class CreateTextSectionNodes < ActiveRecord::Migration[6.0]
  def change
    create_table :text_section_nodes, id: :uuid do |t|
      t.references :text_section, null: false, foreign_key: { on_delete: :cascade }, type: :uuid
      t.bigint :body_hash, null: false, default: 0
      t.column :node_root, :ltree, null: false
      t.column :node_path, :ltree, null: false
      t.text :path, array: true, null: false
      t.integer :node_indices, null: false, array: true
      t.bigint :depth, null: false, default: 0
      t.bigint :node_index, null: true

      t.text :node_type
      t.text :tag
      t.jsonb :node_attributes, null: false, default: {}
      t.text :node_uuid
      t.jsonb :node_extra

      t.text :text_digest
      t.text :content

      t.bigint :children_count, null: false, default: 0

      t.timestamp :extrapolated_at, null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index %i[text_section_id body_hash], name: "index_text_section_nodes_by_id_and_hash"

      t.index %i[text_section_id extrapolated_at], name: "index_text_section_nodes_extrapolation"

      t.index :node_path, unique: true, name: "index_text_section_nodes_uniqueness"
      t.index :node_path, using: :gist
      t.index %i[node_path depth node_index], name: "index_text_section_nodes_child_ordering", using: :gist
    end

    reversible do |dir|
      dir.up do
        execute <<~SQL
        CREATE INDEX index_text_section_nodes_pairing ON text_section_nodes (node_path) INCLUDE (path);
        SQL

        execute <<~SQL
        CREATE INDEX index_text_section_nodes_by_uuid ON text_section_nodes (text_section_id, node_uuid) INCLUDE (node_path);
        SQL

        say_with_time "Populating text_section_nodes" do
          exec_update <<~SQL
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
              CURRENT_TIMESTAMP AS extrapolated_at
            FROM nodes
          ) INSERT INTO text_section_nodes (
            text_section_id, body_hash,
            node_root, node_path, path,
            node_indices, depth, node_index,
            node_type, tag,
            node_attributes,
            node_uuid, text_digest, content,
            node_extra,
            children_count,
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
              EXCLUDED."extrapolated_at" IS DISTINCT FROM text_section_nodes."extrapolated_at"
              THEN CURRENT_TIMESTAMP
            ELSE
              text_section_nodes.updated_at
            END
          SQL
        end
      end
    end
  end
end
