namespace :manifold do
  namespace :job do
    desc "Queue all projects for tweet fetching"
    task queue_fetch_all_tweets: :environment do |_t|
      Manifold::Rake.logger.info "Queuing all projects for tweet fetching"
      ::QueueFetchProjectTweets.perform_now
    end
  end
end
