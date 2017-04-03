class AddDescriptionFormattedToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :description_formatted, :text
  end
end
