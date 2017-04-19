class AddAvatarColorToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :avatar_color, :string, default: "primary"
    execute "UPDATE projects SET avatar_color = 'primary' WHERE avatar_color IS NULL"
  end
end
