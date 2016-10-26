class RemoveUserIdFromAnnotations < ActiveRecord::Migration[5.0]
  def change
    remove_column :annotations, :user_id, :integer, foreign_key: true
  end
end
