class AddStandalonePressBarFieldsToProjects < ActiveRecord::Migration[5.2]
  def change
    add_column :projects, :standalone_mode_press_bar_text, :string
    add_column :projects, :standalone_mode_press_bar_url, :string
  end
end
