# frozen_string_literal: true

class CreateManifoldOAISetLinks < ActiveRecord::Migration[7.0]
  def change
    create_table :manifold_oai_set_links, id: :uuid do |t|
      t.references :manifold_oai_set, null: false, foreign_key: { on_delete: :cascade }, type: :uuid, index: false
      t.references :manifold_oai_record, null: false, foreign_key: { on_delete: :cascade }, type: :uuid, index: false
      t.references :source, polymorphic: true, null: true, type: :uuid, index: { unique: true }

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index %i[manifold_oai_set_id manifold_oai_record_id], unique: true, name: "index_manifold_oai_set_links_uniqueness"
    end
  end
end
