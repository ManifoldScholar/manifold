class CreateStylesheets < ActiveRecord::Migration[5.0]
  def change
    create_table :stylesheets, id: :uuid do |t|
      t.string :name
      t.string :source_identifier
      t.text :styles
      t.text :raw_styles
      t.uuid :text_id
      t.uuid :ingestion_source_id
    end
  end
end
