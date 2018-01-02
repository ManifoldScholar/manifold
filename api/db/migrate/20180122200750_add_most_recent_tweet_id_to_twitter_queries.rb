class AddMostRecentTweetIdToTwitterQueries < ActiveRecord::Migration[5.0]
  def change
    add_column :twitter_queries, :most_recent_tweet_id, :string
  end
end
