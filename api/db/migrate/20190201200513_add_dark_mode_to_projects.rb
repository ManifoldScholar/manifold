class AddDarkModeToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :dark_mode, :boolean, default: false, null: false
  end
end
