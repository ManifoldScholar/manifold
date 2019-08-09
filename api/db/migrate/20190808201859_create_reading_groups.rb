class CreateReadingGroups < ActiveRecord::Migration[5.2]
  def change

    create_table :reading_groups, id: :uuid do |t|
      t.string :name
      t.string :privacy, default: "private"
      t.string :invitation_code
      t.boolean :notify_on_join, default: true
      t.integer :memberships_count
      t.integer :annotations_count
      t.integer :highlights_count
      t.references :creator, type: :uuid,foreign_key: { on_delete: :nullify, to_table: :users }
      t.timestamps
    end

    create_table :reading_group_memberships do |t|
      t.references :user, type: :uuid,foreign_key: { on_delete: :cascade }
      t.references :reading_group, type: :uuid, foreign_key: { on_delete: :cascade }
      t.index [ :user_id, :reading_group_id ], unique: true
      t.timestamps
    end

  end
end
