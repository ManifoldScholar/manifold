class AddPublishedTextToProject < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :published_text_id, :uuid
    remove_column :projects, :published
  end
end
