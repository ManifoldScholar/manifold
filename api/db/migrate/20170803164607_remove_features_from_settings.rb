class RemoveFeaturesFromSettings < ActiveRecord::Migration[5.0]
  def change
    remove_column :settings, :features, :json_b, default: {}
  end
end
