module Tweet
  # This class is responsible for fetching tweets related to a given project
  class Fetcher
    def fetch(project)
      return unless twitter_configured?
      return unless project.following_twitter_accounts?

      project.twitter_queries.active.find_each do |twitter_query|
        fetch_one(twitter_query)
      end
    end

    def fetch_one(twitter_query)
      return unless twitter_configured?

      limit = 60
      options = {
        count: limit,
        result_type: twitter_query.result_type
      }
      options[:since_id] = twitter_query.most_recent_tweet_id.to_i if twitter_query.most_recent_tweet_id.present?
      results = client.search("#{twitter_query.query} -rt", options).take(limit)
      results.each do |tweet|
        tweet_to_event(tweet, twitter_query)
      end

      max = results.max_by(&:id)&.id
      update_query_most_recent(twitter_query, max)
    end

    private

    def tweet_to_event(tweet, query)
      factory = Factory::Event.new
      event = factory.create_from_tweet(tweet, query)
      return if event.valid?

      Rails.logger.info(
        "#tweet_to_event created an invalid event: #{event.errors.full_messages}"
      )
    end

    def update_query_most_recent(query, id)
      return unless id

      query.most_recent_tweet_id = id
      query.save
    end

    def client
      @client ||= Twitter::REST::Client.new do |config|
        config.consumer_key        = settings.integrations.dig(:twitter_app_id)
        config.consumer_secret     = settings.secrets.dig(:twitter_app_secret)
        config.access_token        = settings.integrations.dig(:twitter_access_token)
        config.access_token_secret = settings.secrets.dig(:twitter_access_token_secret)
      end
    end

    def settings
      @settings ||= Settings.instance
    end

    def twitter_configured?
      config = [
        settings.integrations.dig(:twitter_app_id),
        settings.integrations.dig(:twitter_access_token),
        settings.secrets.dig(:twitter_app_secret),
        settings.secrets.dig(:twitter_access_token_secret)
      ]

      config.all?(&:present?)
    end
  end
end
