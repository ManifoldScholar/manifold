class AddFormattedFieldsToResources < ActiveRecord::Migration[5.0]
  def change
    add_column :resources, :title_formatted, :string
    add_column :resources, :description_formatted, :text
    add_column :resources, :caption_formatted, :text
  end
end
