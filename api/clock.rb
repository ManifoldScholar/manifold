require "clockwork"
require "./config/boot"
require "./config/environment"

# This file contains configuration for our background jobs run via Clockwork.
module Clockwork
  handler do |job|
    case job
    when "queue_fetch_project_tweets"
      QueueFetchProjectTweets.perform_later
    end
  end

  every(1.hour, "queue_fetch_project_tweets")
end
