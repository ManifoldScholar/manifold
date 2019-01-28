class UpdateResourceCollectionNotationTypes < ActiveRecord::Migration[5.0]
  def up
    execute <<~SQL.squish
      UPDATE annotations
        SET format = 'resource_collection'
        WHERE format = 'collection'
    SQL
  end

  def down
    execute <<~SQL.squish
      UPDATE annotations
        SET format = 'collection'
        WHERE format = 'resource_collection'
    SQL
  end
end
