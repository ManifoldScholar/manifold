require Rails.root.join "lib", "paperclip_migrator"

class AddAttachmentToIngestionSource < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    paperclip_attachment :ingestion_sources, :attachment
    remove_column :ingestion_sources, :resource_id, :uuid
    remove_column :text_sections, :resource_id, :uuid
    add_column :text_sections, :ingestion_source_id, :uuid, foreign_key: true
  end
end
