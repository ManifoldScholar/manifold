require Rails.root.join "lib", "paperclip_migrator"

class CreateFeatures < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    create_table :features, id: :uuid do |t|
      t.string :header
      t.string :subheader
      t.string :body
      t.string :link_text
      t.string :link_url
      t.string :link_target
      t.integer :foreground_position
      t.integer :foreground_top_padding
      t.integer :position
      t.text :style, default: "dark"
      t.boolean :hidden, default: false
      t.uuid :creator_id, foreign_key: true
      t.timestamps
    end

    paperclip_attachment :features, :background
    paperclip_attachment :features, :foreground
  end
end
