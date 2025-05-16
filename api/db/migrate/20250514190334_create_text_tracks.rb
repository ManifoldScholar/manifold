class CreateTextTracks < ActiveRecord::Migration[6.1]
  def change
    create_table :text_tracks, id: :uuid do |t|
      t.timestamps null: false, default: -> { "CURRENT_TIMESTAMP" }
      t.uuid :resource_id, foreign_key: true, null: false
      t.string :kind, null: false
      t.string :srclang
      t.string :label
      t.jsonb :cues_data, default: nil
      t.index :resource_id
    end
  end
end
