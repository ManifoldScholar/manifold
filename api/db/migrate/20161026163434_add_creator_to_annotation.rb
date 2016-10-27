class AddCreatorToAnnotation < ActiveRecord::Migration[5.0]
  def change
    add_column :annotations, :creator_id, :uuid, foreign_key: true
  end
end
