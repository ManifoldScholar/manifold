class AddHideActivityToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :hide_activity, :boolean, default: false
  end
end
