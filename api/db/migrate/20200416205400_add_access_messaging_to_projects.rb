class AddAccessMessagingToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :restricted_access_heading, :string
    add_column :projects, :restricted_access_body, :text
  end
end
