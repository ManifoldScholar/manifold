class AddTweetFetchConfigToProjects < ActiveRecord::Migration[5.0]
  def change
    add_column :projects, :tweet_fetch_config, :jsonb, default: {}
  end
end
