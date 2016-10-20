class AddFieldsToMaker < ActiveRecord::Migration[5.0]
  def change
    add_column :makers, :first_name, :string
    add_column :makers, :middle_name, :string
    add_column :makers, :last_name, :string
    add_column :makers, :display_name, :string
    add_attachment :makers, :avatar
  end
end
