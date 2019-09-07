class CreateReadingGroups < ActiveRecord::Migration[5.2]
  def change

    create_table :reading_groups, id: :uuid do |t|
      t.string :name
      t.string :privacy, default: "private"
      t.string :invitation_code
      t.boolean :notify_on_join, default: true
      t.integer :memberships_count, default: 0, null: false
      t.integer :all_annotations_count, default: 0, null: false
      t.integer :annotations_count, default: 0, null: false
      t.integer :highlights_count, default: 0, null: false
      t.references :creator, type: :uuid, foreign_key: { on_delete: :nullify, to_table: :users }
      t.timestamps
      t.index :invitation_code, unique: true
    end

    add_reference :annotations, :reading_group, type: :uuid, foreign_key: { on_delete: :nullify, to_table: :reading_groups }

    create_table :reading_group_memberships, id: :uuid do |t|
      t.references :user, type: :uuid,foreign_key: { on_delete: :cascade }
      t.references :reading_group, type: :uuid, foreign_key: { on_delete: :cascade }
      t.index [ :user_id, :reading_group_id ], unique: true
      t.timestamps
    end

    create_view :reading_group_membership_counts
    create_view :reading_group_counts
  end
end
