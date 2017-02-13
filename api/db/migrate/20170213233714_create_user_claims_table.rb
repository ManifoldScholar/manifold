class CreateUserClaimsTable < ActiveRecord::Migration[5.0]
  def change
    create_table :user_claims do |t|
      t.uuid :user_id, foreign_key: true
      t.uuid :maker_id, foreign_key: true
    end
  end
end
