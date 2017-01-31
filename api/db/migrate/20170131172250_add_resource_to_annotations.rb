class AddResourceToAnnotations < ActiveRecord::Migration[5.0]
  def change
    add_column :annotations, :resource_id, :uuid, foreign_key: true
  end
end
