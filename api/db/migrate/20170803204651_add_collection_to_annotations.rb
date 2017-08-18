class AddCollectionToAnnotations < ActiveRecord::Migration[5.0]
  def change
    add_column :annotations, :collection_id, :uuid, foreign_key: true
  end
end
