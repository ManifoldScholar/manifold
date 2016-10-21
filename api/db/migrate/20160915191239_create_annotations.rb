class CreateAnnotations < ActiveRecord::Migration[5.0]
  def change
    create_table :annotations, id: :uuid, default: -> { "uuid_generate_v4()" } do |t|
      t.string :start_node
      t.string:end_node
      t.integer :start_char
      t.integer :end_char
      t.text :subject
      t.uuid :user_id
      t.uuid :text_section_id
      t.string :format
      t.timestamps
    end
  end
end
