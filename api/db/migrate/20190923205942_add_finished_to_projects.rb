class AddFinishedToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :finished, :boolean, default: false
  end
end
