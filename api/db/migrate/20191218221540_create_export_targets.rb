class CreateExportTargets < ActiveRecord::Migration[5.2]
  def change
    create_table :export_targets, id: :uuid do |t|
      t.text :strategy, null: false, default: "unknown"
      t.text :name, null: false
      t.text :slug, null: false
      t.text :configuration_ciphertext, null: false

      t.timestamps null: false

      t.index :slug, unique: true
      t.index :strategy
    end
  end
end
