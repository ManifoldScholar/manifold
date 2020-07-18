class AddProjectCollectionHeaderFields < ActiveRecord::Migration[5.2]
  def change
    add_column :project_collections, :hero_layout, :integer, default: 0, null: false
    add_column :project_collections, :custom_icon_data, :jsonb
    add_column :project_collections, :hero_data, :jsonb
    add_column :project_collections, :social_image_data, :jsonb
    add_column :project_collections, :social_description, :text
    add_column :project_collections, :social_title, :text
  end
end
