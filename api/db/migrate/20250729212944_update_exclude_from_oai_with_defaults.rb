class UpdateExcludeFromOAIWithDefaults < ActiveRecord::Migration[7.0]
  def change
    remove_column :projects, :exclude_from_oai, :boolean
    remove_column :project_collections, :exclude_from_oai, :boolean
    add_column :projects, :exclude_from_oai, :boolean, default: false
    add_column :project_collections, :exclude_from_oai, :boolean, default: false
  end
end
