# Simple job to fetch project tweets in the background.
class FetchProjectTweets < ApplicationJob
  queue_as :default

  rescue_from(Twitter::Error::BadRequest) do |e|
    project = Project.find(arguments[0])
    Rails.logger.error(
      "Fetch Project Tweets: failed to fetch tweets for #{project.title}."
    )
    Rails.logger.error(e)
  end

  def perform(project_id)
    project = Project.find(project_id)
    return unless project

    Tweet::Fetcher.new.fetch(project)
  end
end
