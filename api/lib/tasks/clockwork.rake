namespace :clockwork do
  desc "Queue all projects for tweet fetching"
  task queue_fetch_project_tweets: :environment do |_t|
    QueueFetchProjectTweets.perform_now
  end

  desc "Queue all projects for tweet fetching"
  task :fetch_project_tweets, [:id] => :environment do |_t, args|
    FetchProjectTweets.perform_now(args[:id])
  end
end
