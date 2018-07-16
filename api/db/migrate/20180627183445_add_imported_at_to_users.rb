class AddImportedAtToUsers < ActiveRecord::Migration[5.0]
  def change
    change_table :users do |t|
      t.datetime :imported_at, null: true
      t.string :import_source_id, null: true

      t.index :import_source_id, unique: true, where: %[import_source_id IS NOT NULL]
    end
  end
end
