class AddFieldsToPages < ActiveRecord::Migration[5.0]
  def change
    add_column :pages, :is_external_link, :boolean, default: false
    add_column :pages, :external_link, :text
    add_column :pages, :open_in_new_tab, :boolean, default: false
  end
end
