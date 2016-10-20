class AddFieldsToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :purchase_url, :string
    add_column :projects, :purchase_price_in_cents, :integer
    add_column :projects, :purchase_price_currency, :string
    add_column :projects, :purchase_version_label, :string
    add_column :projects, :instagram_id, :string
    add_column :projects, :twitter_id, :string
    add_column :projects, :facebook_id, :string
    add_attachment :projects, :hero
    add_attachment :projects, :avatar
  end
end
