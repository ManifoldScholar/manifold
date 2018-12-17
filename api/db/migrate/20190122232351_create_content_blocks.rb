class CreateContentBlocks < ActiveRecord::Migration[5.0]
  def change
    create_table :content_blocks, id: :uuid do |t|
      t.string :type, null: false
      t.jsonb :configuration, null: false, default: {}
      t.integer :position
      t.belongs_to :project, type: :uuid
    end
  end
end
