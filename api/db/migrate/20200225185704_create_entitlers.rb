class CreateEntitlers < ActiveRecord::Migration[5.2]
  def change
    create_table :entitlers, id: :uuid do |t|
      t.references  :entity,    null: false, type: :uuid, polymorphic: true, index: { unique: true, name: "index_entitlers_entity_uniqueness" }
      t.text        :name,      null: false
      t.jsonb       :metadata,  null: false, default: {}

      t.timestamps
    end
  end
end
