module Tweet
  # This class is responsible for fetching tweets related to a given project
  class Fetcher
    def fetch(project)
      return unless project.following_twitter_accounts?
      project.twitter_following.each do |following|
        fetch_one(following, project)
      end
    end

    private

    def fetch_one(following, project)
      query = build_query(following)
      client.search(query).each do |tweet|
        tweet_to_event(tweet, project)
      end
    end

    def tweet_to_event(tweet, project)
      factory = Factory::Event.new
      event = factory.create_from_tweet(tweet, project)
      return if event.valid?
      Rails.logger.info(
        "#tweet_to_event created an invalid event: #{event.errors.full_messages}"
      )
    end

    # rubocop:disable Metrics/AbcSize
    def build_query(following)
      user, hashtag, since, keyword = following.values_at(:user,
                                                          :hashtag,
                                                          :since,
                                                          :keyword)
      parts = []
      parts.push "from:#{user.strip}" unless user.blank?
      parts.push "##{hashtag.strip}" unless hashtag.blank?
      parts.push "since:#{since.strip}" unless since.blank?
      parts.push keyword.strip unless keyword.blank?
      parts.join(" ")
    end
    # rubocop:enable Metrics/AbcSize

    def client
      settings = Settings.instance
      @client ||= Twitter::REST::Client.new do |config|
        config.consumer_key        = settings.integrations.dig(:twitter_app_id)
        config.consumer_secret     = settings.secrets.dig(:twitter_app_secret)
        config.access_token        = settings.integrations.dig(:twitter_access_token)
        config.access_token_secret = settings.secrets.dig(:twitter_access_token_secret)
      end
    end
  end
end
