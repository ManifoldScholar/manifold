class CreateUserGroups < ActiveRecord::Migration[7.0]
  def change
    create_table :user_groups, id: :uuid do |t|
      t.text :name, null: false

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
    end

    create_table :user_group_entitleables, id: :uuid do |t|
      t.references :user_group, type: :uuid, null: false
      t.references :entitleable, type: :uuid, null: false, polymorphic: true

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
    end

    create_table :user_group_memberships, id: :uuid do |t|
      t.references :user, type: :uuid, null: false
      t.references :user_group, type: :uuid, null: false

      t.text :source

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
    end
  end
end
