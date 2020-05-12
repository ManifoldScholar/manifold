class AddPositionToContentBlockReferences < ActiveRecord::Migration[5.2]
  def change
    add_column :content_block_references, :position, :integer
  end
end
