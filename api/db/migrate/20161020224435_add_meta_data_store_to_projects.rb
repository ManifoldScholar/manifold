class AddMetaDataStoreToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :metadata, :jsonb, default: {}
  end
end
