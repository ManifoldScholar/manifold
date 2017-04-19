class AddAvatarColorToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :avatar_color, :string
  end
end
