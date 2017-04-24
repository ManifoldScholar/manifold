class CreateThumbnailFetchAttempts < ActiveRecord::Migration[5.0]
  def change
    create_table :thumbnail_fetch_attempts, id: :uuid do |t|
      t.boolean :successful, null: false, default: false
      t.integer :attempts, default: 0
      t.string :reference
      t.references :resource, type: :uuid
    end
  end
end
