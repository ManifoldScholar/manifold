class RemoveDownloadAttributesFromProjects < ActiveRecord::Migration[5.0]
  def change
    remove_column :projects, :download_url, :string
    remove_column :projects, :download_call_to_action, :string
  end
end
