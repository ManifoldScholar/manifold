class RolifyCreateRoles < ActiveRecord::Migration[5.0]
  def change
    create_table :roles, id: :uuid do |t|
      t.string :name, null: false
      t.references :resource, null: true, type: :uuid, index: true, polymorphic: true

      t.timestamps
    end

    create_table :users_roles, :id => false do |t|
      t.references :user, null: false, type: :uuid, index: true, foreign_key: { on_delete: :cascade }
      t.references :role, null: false, type: :uuid, index: true, foreign_key: { on_delete: :cascade }
    end

    add_index :roles, :name
    add_index :roles, [ :name, :resource_type, :resource_id ], unique: true
    add_index :users_roles, [ :user_id, :role_id ], unique: true
  end
end
