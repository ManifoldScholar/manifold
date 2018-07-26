class MigrateExistingStylesheetsToTextSections < ActiveRecord::Migration[5.0]
  def change
    reversible do |dir|
      dir.up do
        say_with_time "Associating existing Stylesheets with TextSections" do
          execute <<~SQL.strip
            INSERT INTO text_section_stylesheets (text_section_id, stylesheet_id, created_at, updated_at) 
              SELECT ts.id AS text_section_id, ss.id AS stylesheet_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
              FROM text_sections ts
              INNER JOIN stylesheets ss ON ss.text_id = ts.text_id
          SQL
        end
      end

      dir.down do
        say_with_time "Removing existing TextSection Stylesheet associations" do
          execute <<~SQL.squish
            DELETE FROM text_section_stylesheets
          SQL
        end
      end
    end
  end
end
