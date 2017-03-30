class CreateIngestions < ActiveRecord::Migration[5.0]
  def change
    create_table :ingestions, id: :uuid do |t|
      t.string :state
      t.string :log, array: true
      t.attachment :source
      t.string :strategy
      t.string :external_source_url
      t.string :ingestion_type
      t.uuid :creator_id, foreign_key: true
      t.uuid :text_id, foreign_key: true
      t.uuid :project_id, foreign_key: true
      t.timestamps
    end
  end
end
