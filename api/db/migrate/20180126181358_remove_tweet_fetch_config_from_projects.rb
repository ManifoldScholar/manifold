class RemoveTweetFetchConfigFromProjects < ActiveRecord::Migration[5.0]
  def change
    remove_column :projects, :tweet_fetch_config
  end
end
