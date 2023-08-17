class AddIframeAllowsToResources < ActiveRecord::Migration[6.1]
  def up
    add_column :resources, :iframe_allows, :string, array: true, null: false, default: ["fullscreen"]
    remove_column :resources, :iframe_allow_fullscreen, :boolean
  end

  def down
    remove_column :resources, :iframe_allows, :string, array: true
    add_column :resources, :iframe_allow_fullscreen, :boolean, default: true
  end
end
