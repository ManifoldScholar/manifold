class ChangeProjectPriceLimit < ActiveRecord::Migration[5.0]
  def change
    change_column :projects, :purchase_price_in_cents, :integer, limit: 8
  end
end
