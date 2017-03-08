class CreateSettings < ActiveRecord::Migration[5.0]
  def change
    create_table :settings do |t|
      t.jsonb :general, default: {}
      t.jsonb :theme, default: {}
      t.jsonb :oauth, default: {}
      t.jsonb :features, default: {}
      t.integer :singleton_guard

      t.timestamps
    end
    add_index(:settings, :singleton_guard, :unique => true)
  end
end
