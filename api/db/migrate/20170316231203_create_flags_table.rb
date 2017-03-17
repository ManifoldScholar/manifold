class CreateFlagsTable < ActiveRecord::Migration[5.0]
  def change
    create_table :flags, id: :uuid do |t|
      t.uuid :creator_id, foreign_key: true
      t.uuid :flaggable_id, foreign_key: true
      t.string :flaggable_type
      t.timestamps
    end
  end
end
