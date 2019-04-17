require Rails.root.join "lib", "paperclip_migrator"

class AddFieldsToProjects < ActiveRecord::Migration[5.0]
  include PaperclipMigrator

  def change
    add_column :projects, :purchase_url, :string
    add_column :projects, :purchase_price_in_cents, :integer
    add_column :projects, :purchase_price_currency, :string
    add_column :projects, :purchase_version_label, :string
    add_column :projects, :instagram_id, :string
    add_column :projects, :twitter_id, :string
    add_column :projects, :facebook_id, :string
    paperclip_attachment :projects, :hero
    paperclip_attachment :projects, :avatar
  end
end
