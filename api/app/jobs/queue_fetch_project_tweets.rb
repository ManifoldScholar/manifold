# Simple job to create a new event in the background.
class QueueFetchProjectTweets < ApplicationJob
  queue_as :default

  def perform
    Project.all.each do |project|
      FetchProjectTweets.perform_later(project.id)
    end
  end
end
