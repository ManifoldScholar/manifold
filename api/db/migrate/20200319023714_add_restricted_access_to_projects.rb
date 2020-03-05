class AddRestrictedAccessToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :restricted_access, :boolean, null: false, default: false

    add_index :projects, :restricted_access
  end
end
