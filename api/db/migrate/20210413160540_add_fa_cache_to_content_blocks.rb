class AddFaCacheToContentBlocks < ActiveRecord::Migration[6.0]
  def change
    add_column :content_blocks, :fa_cache, :jsonb, null: false, default: {}
  end
end
