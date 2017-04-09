class RemoveFormattedAttributes < ActiveRecord::Migration[5.0]
  def change
    remove_column :projects, :description_formatted, :text 
    remove_column :resources, :caption_formatted, :text
    remove_column :resources, :description_formatted, :text
    remove_column :resources, :title_formatted, :text
  end
end
