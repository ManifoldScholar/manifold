class AddAppliesToAllToStylesheets < ActiveRecord::Migration[6.0]
  def change
    add_column :stylesheets, :applies_to_all_text_sections, :boolean, default: false
  end
end
