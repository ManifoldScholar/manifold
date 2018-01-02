class CreateTwitterQueries < ActiveRecord::Migration[5.0]
  def change

    create_table :twitter_queries, id: :uuid  do |t|
      t.timestamps
      t.uuid :project_id, foreign_key: true
      t.uuid :creator_id, foreign_key: true
      t.string :query
      t.boolean :active, default: true, null: false
      t.integer :events_count, default: 0
    end

    add_column :events, :twitter_query_id, :uuid, foreign_key: true
  end
end
