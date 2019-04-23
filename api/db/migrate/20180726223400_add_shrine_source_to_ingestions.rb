require Rails.root.join "lib", "paperclip_migrator"

class AddShrineSourceToIngestions < ActiveRecord::Migration[5.0]
  def change
    add_column :ingestions, :source_data, :jsonb, null: false, default: {}

    reversible do |dir|
      dir.up do
        say_with_time "Migrating :source from paperclip to shrine" do
          PaperclipMigrator.migrate_all! Ingestion, :source
        end
      end
    end
  end
end
