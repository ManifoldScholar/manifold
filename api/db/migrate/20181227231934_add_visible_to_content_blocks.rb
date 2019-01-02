class AddVisibleToContentBlocks < ActiveRecord::Migration[5.0]
  def change
    add_column :content_blocks, :visible, :boolean, default: true, null: false
  end
end
