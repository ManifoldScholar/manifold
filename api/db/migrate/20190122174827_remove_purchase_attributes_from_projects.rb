class RemovePurchaseAttributesFromProjects < ActiveRecord::Migration[5.0]
  def change
    remove_column :projects, :purchase_url, :string
    remove_column :projects, :purchase_price_in_cents, :bigint
    remove_column :projects, :purchase_price_currency, :string
    remove_column :projects, :purchase_call_to_action, :string
  end
end
