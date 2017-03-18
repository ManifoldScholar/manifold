class CreateCommentModel < ActiveRecord::Migration[5.0]
  def change
    create_table :comments, id: :uuid do |t|
      t.text :body
      t.uuid :creator_id
      t.integer :flags
      t.uuid :parent_id
      t.uuid :subject_id
      t.string :subject_type
      t.timestamps
    end
  end
end
