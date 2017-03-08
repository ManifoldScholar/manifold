class AddCreatedByFieldsToModels < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :creator_id, :uuid, foreign_key: true
    add_column :texts, :creator_id, :uuid, foreign_key: true
    add_column :resources, :creator_id, :uuid, foreign_key: true
    add_column :pages, :creator_id, :uuid, foreign_key: true
  end
end
