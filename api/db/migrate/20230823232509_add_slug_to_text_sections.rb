# frozen_string_literal: true

class AddSlugToTextSections < ActiveRecord::Migration[6.1]
  LANG = "SQL"

  def change
    enable_extension "unaccent"

    change_table :text_sections do |t|
      t.text :slug

      t.index %i[text_id slug], unique: true
    end

    reversible do |dir|
      dir.up do
        execute <<~SQL
        CREATE FUNCTION manifold_slugify(text) RETURNS text AS $$
          -- removes accents (diacritic signs) from a given string --
          WITH "unaccented" AS (
            SELECT unaccent(btrim($1)) AS "value"
          ),
          -- lowercases the string
          "lowercase" AS (
            SELECT lower("value") AS "value"
            FROM "unaccented"
          ),
          -- replaces anything that's not a letter, number, hyphen('-'), or underscore('_') with a hyphen('-')
          "hyphenated" AS (
            SELECT regexp_replace("value", '[^a-z0-9_-]+', '-', 'gi') AS "value"
            FROM "lowercase"
          ),
          -- trims hyphens('-') if they exist on the head or tail of the string
          "trimmed" AS (
            SELECT regexp_replace(regexp_replace("value", '-+$', ''), '^-+', '') AS "value"
            FROM "hyphenated"
          )
          SELECT NULLIF("value", '') FROM "trimmed";
        $$ LANGUAGE #{LANG} IMMUTABLE STRICT PARALLEL SAFE;
        SQL

        say_with_time "Populating initial text section slugs" do
          exec_update(<<~SQL)
          WITH text_section_slugs AS (
            SELECT text_id,
              id AS text_section_id,
              COALESCE(manifold_slugify(name), manifold_slugify(id::text)) AS pristine_slug,
              manifold_slugify(CONCAT_WS('-', name, id::text)) AS discriminator_slug,
              created_at
              FROM text_sections
          ), pristine_slugs AS (
            SELECT DISTINCT ON (text_id, pristine_slug) text_id, text_section_id, pristine_slug AS slug
            FROM text_section_slugs
            ORDER BY text_id, pristine_slug, created_at DESC
          ), discriminated_slugs AS (
            SELECT DISTINCT ON (text_id, discriminator_slug) text_id, text_section_id, discriminator_slug AS slug
            FROM text_section_slugs
            LEFT OUTER JOIN pristine_slugs USING (text_id, text_section_id)
            WHERE pristine_slugs.slug IS NULL
            ORDER BY text_id, discriminator_slug, created_at DESC
          ), merged_slugs AS (
            SELECT text_id, text_section_id, slug FROM pristine_slugs
            UNION ALL
            SELECT text_id, text_section_id, slug FROM discriminated_slugs
          )
          UPDATE text_sections ts SET slug = ms.slug
          FROM merged_slugs ms WHERE ms.text_section_id = ts.id;
          SQL
        end
      end

      dir.down do
        execute <<~SQL
        DROP FUNCTION manifold_slugify(text);
        SQL
      end
    end
  end
end
