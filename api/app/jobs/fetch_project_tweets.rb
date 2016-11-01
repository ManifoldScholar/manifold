# Simple job to fetch project tweets in the background.
class FetchProjectTweets < ApplicationJob
  queue_as :default

  def perform(project_id)
    project = Project.find(project_id)
    return unless project
    Tweet::Fetcher.new.fetch(project)
  end
end
