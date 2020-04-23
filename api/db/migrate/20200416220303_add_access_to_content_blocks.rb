class AddAccessToContentBlocks < ActiveRecord::Migration[5.2]
  def change
    add_column :content_blocks, :access, :integer, default: 0, null: false
  end
end
