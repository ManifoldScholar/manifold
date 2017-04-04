class AddInteractiveAttributesToResources < ActiveRecord::Migration[5.0]
  def change
    add_column :resources, :iframe_dimensions, :string
    add_column :resources, :is_iframe, :boolean, default: false
    add_column :resources, :embed_code, :text
  end
end
