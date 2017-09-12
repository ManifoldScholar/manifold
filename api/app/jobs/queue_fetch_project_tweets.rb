# Simple job to create a new event in the background.
class QueueFetchProjectTweets < ApplicationJob
  queue_as :default

  def perform
    Project.where.not(tweet_fetch_config: "{}").each do |project|
      FetchProjectTweets.perform_later(project.id)
    end
  end
end
