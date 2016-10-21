class CreateFavorites < ActiveRecord::Migration[5.0]
  def change
    create_table :favorites, id: :uuid do |t|
      t.uuid :favoritable_id
      t.string :favoritable_type
      t.uuid :user_id
      t.timestamps
    end
  end
end
