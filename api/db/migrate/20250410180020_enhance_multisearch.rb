# frozen_string_literal: true

class EnhanceMultisearch < ActiveRecord::Migration[6.1]
  LANG = "SQL"

  def change
    add_functions!

    add_generated_columns_to_pg_search_documents!

    add_tsearch_indices!

    add_body_text_to_text_sections!

    cache_user_full_names!
  end

  private

  def add_body_text_to_text_sections!
    change_table :text_sections do |t|
      t.text :body_text
    end

    reversible do |dir|
      dir.up do
        say_with_time "Populating text_sections.body_text" do
          exec_update(<<~SQL)
          UPDATE text_sections SET body_text = public.extract_text_section_content(body_json);
          SQL
        end
      end
    end
  end

  def add_generated_columns_to_pg_search_documents!
    reversible do |dir|
      dir.up do
        execute <<~SQL
        ALTER TABLE pg_search_documents
          ADD COLUMN tsv_composite tsvector NOT NULL GENERATED ALWAYS AS (
            public.to_unaccented_weighted_tsv(title, 'A')
            ||
            public.to_unaccented_weighted_tsv(primary_data, 'A')
            ||
            public.to_unaccented_weighted_tsv(secondary, 'B')
            ||
            public.to_unaccented_weighted_tsv(secondary_data, 'B')
            ||
            public.to_unaccented_weighted_tsv(tertiary, 'C')
            ||
            public.to_unaccented_weighted_tsv(tertiary_data, 'C')
            ||
            public.to_unaccented_weighted_tsv(content, 'D')
            ||
            public.to_unaccented_weighted_tsv(metadata, 'D')
          ) STORED
        ;
        SQL
      end

      dir.down do
        execute <<~SQL
        ALTER TABLE pg_search_documents
          DROP COLUMN tsv_composite
        ;
        SQL
      end
    end
  end

  def add_tsearch_indices!
    change_table :pg_search_documents do |t|
      t.index :tsv_composite, using: :gin
    end
  end

  # @return [void]
  def add_functions!
    reversible do |dir|
      dir.up do
        execute <<~SQL
        CREATE FUNCTION jsonb_extract_strings(jsonb) RETURNS SETOF text AS $$
        WITH RECURSIVE extracted_objects(path, value) AS (
          SELECT
            key AS path,
            value
          FROM pg_catalog.jsonb_each(jsonb_build_object('input', $1)) AS t(key, value)
          UNION ALL
          SELECT
          path || '.' || COALESCE(obj_key, (arr_key- 1)::text),
          COALESCE(obj_value, arr_value)
          FROM extracted_objects
          LEFT JOIN LATERAL
          jsonb_each(case jsonb_typeof(value) when 'object' then value end)
          AS o(obj_key, obj_value)
          ON jsonb_typeof(value) = 'object'
          LEFT JOIN LATERAL
          jsonb_array_elements(CASE jsonb_typeof(value) WHEN 'array' THEN value END)
          WITH ORDINALITY AS a(arr_value, arr_key)
          ON jsonb_typeof(value) = 'array'
          WHERE obj_key IS NOT NULL or arr_key IS NOT NULL
        )
        SELECT
          value #>> '{}'
        FROM extracted_objects
          WHERE jsonb_typeof(value) = 'string'
        ;
        $$ LANGUAGE #{LANG} IMMUTABLE STRICT PARALLEL SAFE;

        CREATE FUNCTION public.immutable_unaccent(text) RETURNS text AS $$
        SELECT public.unaccent('public.unaccent'::regdictionary, $1);
        $$ LANGUAGE #{LANG} IMMUTABLE STRICT PARALLEL SAFE;

        COMMENT ON FUNCTION public.immutable_unaccent(text) IS 'An expression-indexable version of unaccent that uses the default dictionary.';

        CREATE FUNCTION public.to_unaccented_tsv(jsonb) RETURNS tsvector AS $$
        SELECT pg_catalog.to_tsvector('pg_catalog.english'::regconfig, COALESCE(pg_catalog.STRING_AGG(public.immutable_unaccent(str), ' '), ''))
        FROM public.jsonb_extract_strings($1) AS t(str);
        $$ LANGUAGE #{LANG} IMMUTABLE CALLED ON NULL INPUT PARALLEL SAFE;

        CREATE FUNCTION public.to_unaccented_tsv(text) RETURNS tsvector AS $$
        SELECT pg_catalog.to_tsvector('pg_catalog.english'::regconfig, COALESCE(public.immutable_unaccent($1), ''));
        $$ LANGUAGE #{LANG} IMMUTABLE CALLED ON NULL INPUT PARALLEL SAFE;

        CREATE FUNCTION public.to_unaccented_weighted_tsv(jsonb, "char") RETURNS tsvector AS $$
        SELECT pg_catalog.setweight(public.to_unaccented_tsv($1), $2);
        $$ LANGUAGE #{LANG} IMMUTABLE CALLED ON NULL INPUT PARALLEL SAFE;

        CREATE FUNCTION public.to_unaccented_weighted_tsv(text, "char") RETURNS tsvector AS $$
        SELECT pg_catalog.setweight(public.to_unaccented_tsv($1), $2);
        $$ LANGUAGE #{LANG} IMMUTABLE CALLED ON NULL INPUT PARALLEL SAFE;

        CREATE FUNCTION public.extract_text_section_content(jsonb) RETURNS text AS $$
        SELECT
          pg_catalog.string_agg(TRIM(content #>> '{}'), ' ' ORDER BY idx ASC) FILTER (WHERE content #>> '{}' ~ '[^[:space:]]+')
        FROM
          pg_catalog.jsonb_path_query($1, 'strict $.**.content') WITH ORDINALITY AS t(content, idx)
        ;
        $$ LANGUAGE #{LANG} IMMUTABLE STRICT PARALLEL SAFE;
        SQL
      end

      dir.down do
        execute <<~SQL
        DROP FUNCTION public.extract_text_section_content(jsonb);
        DROP FUNCTION public.to_unaccented_weighted_tsv(text, "char");
        DROP FUNCTION public.to_unaccented_weighted_tsv(jsonb, "char");
        DROP FUNCTION public.to_unaccented_tsv(text);
        DROP FUNCTION public.to_unaccented_tsv(jsonb);
        DROP FUNCTION public.immutable_unaccent(text);
        DROP FUNCTION public.jsonb_extract_strings(jsonb);
        SQL
      end
    end
  end

  def cache_user_full_names!
    change_table :users do |t|
      t.text :cached_full_name
    end

    reversible do |dir|
      dir.up do
        say_with_time "Populating users.cached_full_name" do
          exec_update(<<~SQL)
          UPDATE users SET cached_full_name = CONCAT_WS(' ', first_name, last_name)
          SQL
        end
      end
    end
  end
end
