class AddCounterCacheToCollection < ActiveRecord::Migration[5.0]
  def up
    add_column :collections, :collection_resources_count, :integer, default: 0

    # Renamed :collections table in 20190128190055
    execute <<~SQL.squish
      WITH counts AS (
        SELECT collection_id, COUNT(DISTINCT resource_id) AS collection_resources_count FROM collection_resources GROUP BY collection_id
      )
      UPDATE collections SET collection_resources_count = counts.collection_resources_count FROM counts WHERE counts.collection_id = collections.id
    SQL
  end

  def down
    remove_column :collections, :collection_resources_count, :integer
  end
end
