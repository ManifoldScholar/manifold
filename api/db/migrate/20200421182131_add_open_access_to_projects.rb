class AddOpenAccessToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :open_access, :boolean, null: false, default: false

    add_index :projects, :open_access
  end
end
