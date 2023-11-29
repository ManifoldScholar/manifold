class AdjustUserKeyConstraints < ActiveRecord::Migration[6.1]
  def change

    remove_foreign_key :ingestions, :users, column: :creator_id
    add_foreign_key :ingestions, :users, column: :creator_id, on_delete: :nullify

    change_column_null :ingestions, :creator_id, true
  end
end
