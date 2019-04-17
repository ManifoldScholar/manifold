require Rails.root.join "lib", "paperclip_migrator"

class CreateCollections < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    create_table :collections, id: :uuid do |t|
      t.string :title
      t.text :description
      t.uuid :project_id, foreign_key: true
      t.string :thumbnail_checksum
      t.string :fingerprint
      t.timestamps
    end

    paperclip_attachment :collections, :thumbnail

    create_table :collection_resources, id: :uuid do |t|
      t.uuid :resource_id, foreign_key: true
      t.uuid :collection_id, foreign_key: true
      t.integer :position, default: 0
      t.timestamps
    end
  end
end
