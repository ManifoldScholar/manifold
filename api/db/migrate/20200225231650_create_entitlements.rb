class CreateEntitlements < ActiveRecord::Migration[5.2]
  def change
    create_table :entitlements, id: :uuid do |t|
      t.references :target,   type: :uuid, null: false, polymorphic: true
      t.references :entitler, type: :uuid, null: false, foreign_key: { on_delete: :restrict }
      t.references :subject,  type: :uuid, null: false, polymorphic: true

      t.date :expires_on,      null: true
      t.timestamp :expired_at, null: true

      t.text :kind,           null: false, default: "unknown"
      t.text :description,    null: false, default: ""

      t.jsonb :global_roles,  null: false, default: {}
      t.jsonb :scoped_roles,  null: false, default: {}
      t.jsonb :options,       null: false, default: {}
      t.jsonb :metadata,      null: false, default: {}

      t.timestamps

      t.index %i[target_type target_id entitler_id subject_type subject_id], name: "index_entitlements_uniqueness"
      t.index :expires_on
      t.index :expired_at
      t.index :global_roles, using: :gin
      t.index :scoped_roles, using: :gin
    end
  end
end
