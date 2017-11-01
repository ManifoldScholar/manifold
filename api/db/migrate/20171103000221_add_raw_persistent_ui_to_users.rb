class AddRawPersistentUiToUsers < ActiveRecord::Migration[5.0]
  def change
    add_column :users, :raw_persistent_ui, :jsonb, null: false, default: {}
  end
end
