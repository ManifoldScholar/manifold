class AddDownloadUrlToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :download_url, :string
    add_column :projects, :download_call_to_action, :string
  end
end
