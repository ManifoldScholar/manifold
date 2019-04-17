require Rails.root.join "lib", "paperclip_migrator"

class AddFieldsToMaker < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    add_column :makers, :first_name, :string
    add_column :makers, :middle_name, :string
    add_column :makers, :last_name, :string
    add_column :makers, :display_name, :string
    paperclip_attachment :makers, :avatar
  end
end
