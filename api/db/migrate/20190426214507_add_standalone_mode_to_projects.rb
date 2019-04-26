class AddStandaloneModeToProjects < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :standalone_mode, :integer, default: 0, null: false
  end
end
