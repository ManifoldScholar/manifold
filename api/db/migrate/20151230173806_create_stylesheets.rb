class CreateStylesheets < ActiveRecord::Migration[5.0]
  def change
    create_table :stylesheets do |t|
      t.string :name
      t.string :source_identifier
      t.text :styles
      t.text :raw_styles
      t.integer :text_id
      t.integer :ingestion_source_id
    end
  end
end
