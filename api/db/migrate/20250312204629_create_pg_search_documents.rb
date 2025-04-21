# frozen_string_literal: true

class CreatePgSearchDocuments < ActiveRecord::Migration[6.1]
  LANG = "SQL"

  def up
    execute <<~SQL
    CREATE TYPE manifold_lang AS ENUM ('simple', 'english');
    SQL

    execute <<~SQL
    CREATE OR REPLACE FUNCTION lang2dictionary(public.manifold_lang) RETURNS regconfig AS $$
    SELECT CASE $1
    WHEN 'english' THEN 'pg_catalog.english'::regconfig
    ELSE
      'pg_catalog.simple'::regconfig
    END;
    $$ LANGUAGE #{LANG} IMMUTABLE CALLED ON NULL INPUT PARALLEL SAFE;
    SQL

    say_with_time("Creating table for pg_search multisearch") do
      create_table :pg_search_documents, id: :uuid do |t|
        t.references :searchable, polymorphic: true, index: { unique: true }, type: :uuid
        t.references :journal, foreign_key: { on_delete: :nullify }, null: true, type: :uuid
        t.references :project, foreign_key: { on_delete: :cascade }, null: true, type: :uuid
        t.references :text, foreign_key: { on_delete: :cascade }, null: true, type: :uuid
        t.references :text_section, foreign_key: { on_delete: :cascade }, null: true, type: :uuid

        t.column :lang, :manifold_lang, null: false, default: "english"

        # Holdover from searchkick
        t.text :search_result_type

        t.text :title # will weight as A
        t.jsonb :primary_data # will weight as A

        t.text :secondary # will weight as B
        t.jsonb :secondary_data # will be weighted as B

        t.text :tertiary # will weight as C
        t.jsonb :tertiary_data # will be weighted as C

        t.text :content # will weight as D
        t.jsonb :metadata # will weight as D alongside content

        t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
      end
    end
  end

  def down
    say_with_time("Dropping table for pg_search multisearch") do
      drop_table :pg_search_documents
    end

    execute <<~SQL
    DROP FUNCTION lang2dictionary(public.manifold_lang);
    SQL

    execute <<~SQL
    DROP TYPE manifold_lang;
    SQL
  end
end
