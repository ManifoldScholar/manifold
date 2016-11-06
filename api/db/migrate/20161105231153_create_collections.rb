class CreateCollections < ActiveRecord::Migration[5.0]
  def change
    create_table :collections, id: :uuid do |t|
      t.string :title
      t.text :description
      t.uuid :project_id, foreign_key: true
      t.attachment :thumbnail
      t.string :thumbnail_checksum
      t.string :fingerprint
    end

    create_table :collection_resources, id: :uuid do |t|
      t.uuid :resource_id, foreign_key: true
      t.uuid :collection_id, foreign_key: true
      t.integer :position, default: 0
    end
  end
end
