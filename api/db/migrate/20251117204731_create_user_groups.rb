class CreateUserGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :user_groups, id: :uuid do |t|
      t.text :name, null: false

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index :name, unique: true
    end

    create_table :user_group_entitleables, id: :uuid do |t|
      t.references :user_group, type: :uuid, null: false
      t.references :entitleable, type: :uuid, null: false, polymorphic: true

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index [:user_group_id, :entitleable_type, :entitleable_id],
              unique: true,
              name: "index_user_group_entitleables_on_user_group_and_entitleable"
    end

    create_table :user_group_memberships, id: :uuid do |t|
      t.references :user, type: :uuid, null: false
      t.references :user_group, type: :uuid, null: false

      t.references :source, polymorphic: true, type: :uuid

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index [:user_id, :user_group_id], unique: true
    end
  end
end
