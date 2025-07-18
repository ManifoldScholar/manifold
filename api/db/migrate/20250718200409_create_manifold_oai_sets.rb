# frozen_string_literal: true

class CreateManifoldOAISets < ActiveRecord::Migration[7.0]
  def change
    create_table :manifold_oai_sets, id: :uuid do |t|
      t.references :source, polymorphic: true, null: true, type: :uuid, index: { unique: true }

      t.citext :spec, null: false
      t.text :name, null: false
      t.text :description

      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }

      t.index :spec, unique: true
    end
  end
end
