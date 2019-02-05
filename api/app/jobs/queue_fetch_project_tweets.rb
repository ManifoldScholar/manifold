# Simple job to create a new event in the background.
class QueueFetchProjectTweets < ApplicationJob
  queue_as :default

  def perform
    Project.find_each do |project|
      next unless project.following_twitter_accounts?

      FetchProjectTweets.perform_later(project.id)
    end
  end
end
