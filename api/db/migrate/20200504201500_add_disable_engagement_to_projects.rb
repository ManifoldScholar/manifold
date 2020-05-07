class AddDisableEngagementToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :disable_engagement, :boolean, default: false
  end
end
