class CreateFeatures < ActiveRecord::Migration[5.0]
  def change
    create_table :features, id: :uuid do |t|
      t.string :header
      t.string :subheader
      t.string :body
      t.string :link_text
      t.string :link_url
      t.string :link_target
      t.attachment :background
      t.attachment :foreground
      t.integer :foreground_position
      t.integer :foreground_top_padding
      t.integer :position
      t.text :style, default: "dark"
      t.boolean :hidden, default: false
      t.uuid :creator_id, foreign_key: true
      t.timestamps
    end
  end
end
