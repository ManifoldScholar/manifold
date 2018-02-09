class RemoveUserClaims < ActiveRecord::Migration[5.0]
  def up
    drop_table :user_claims
  end

  def down
    create_table :user_claims do |t|
      t.uuid :user_id, foreign_key: true
      t.uuid :maker_id, foreign_key: true
    end
  end
end
