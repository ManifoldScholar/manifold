class CreateEvents < ActiveRecord::Migration[5.0]
  def change
    create_table :events, id: :uuid do |t|
      t.string :event_type
      t.string :event_url
      t.uuid :subject_id, foreign_key: true
      t.string :subject_type
      t.string :subject_title
      t.string :subject_subtitle
      t.string :attribution_name
      t.string :attribution_url
      t.string :attribution_identifier
      t.text :excerpt
      t.uuid :project_id, foreign_key: true
      t.string :event_title

      t.timestamps
    end
  end
end
