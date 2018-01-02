class AddResultTypeToTwitterQueries < ActiveRecord::Migration[5.0]
  def change
    add_column :twitter_queries, :result_type, :string, default: 'most_recent'
  end
end
