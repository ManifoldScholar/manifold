# This migration and AddTransactionIdColumnToVersions provide the necessary
# schema for tracking associations.
class CreateVersionAssociations < ActiveRecord::Migration[5.2]
  def self.up
    create_table :version_associations do |t|
      t.integer  :version_id
      t.string   :foreign_key_name, null: false
      t.integer  :foreign_key_id
      t.string   :foreign_type
    end
    add_index :version_associations, [:version_id]
    add_index :version_associations,
      %i(foreign_key_name foreign_key_id foreign_type),
      name: "index_version_associations_on_foreign_key"
  end

  def self.down
    remove_index :version_associations, [:version_id]
    remove_index :version_associations,
      name: "index_version_associations_on_foreign_key"
    drop_table :version_associations
  end
end
