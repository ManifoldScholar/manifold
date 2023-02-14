class AddBodyHashToTextSections < ActiveRecord::Migration[6.0]
  def change
    enable_extension "ltree"
    enable_extension "intarray"
    enable_extension "btree_gist"
    enable_extension "btree_gin"

    reversible do |dir|
      dir.up do
        say_with_time "Adding calculated body_hash column" do
          execute(<<~SQL)
          ALTER TABLE text_sections
            ADD COLUMN body_hash bigint NOT NULL GENERATED ALWAYS AS (COALESCE(hashtextextended(body_json::text, 0), 0)) STORED,
            ADD COLUMN node_root ltree NOT NULL GENERATED ALWAYS AS (text2ltree(md5(id::text) || '.' || md5(COALESCE(hashtextextended(body_json::text, 0), 0)::text))) STORED
            ;
          SQL
        end
      end

      dir.down do
        remove_column :text_sections, :body_hash
        remove_column :text_sections, :node_root
      end
    end

    change_table :text_sections do |t|
      t.index %i[id body_hash node_root], name: "index_text_sections_on_extrapolated_nodes"
    end
  end
end
