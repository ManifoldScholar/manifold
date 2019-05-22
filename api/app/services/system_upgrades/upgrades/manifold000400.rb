module SystemUpgrades
  module Upgrades
    class Manifold000400 < SystemUpgrades::AbstractVersion

      def perform!
        create_twitter_queries
      end

      private

      # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
      def create_twitter_queries
        logger.info("===================================================================")
        logger.info("Create Twitter Queries                                             ")
        logger.info("===================================================================")
        logger.info("Manifold 0.4.0 uses Twitter Query records to fetch tweets instead  ")
        logger.info("of a 'tweet_fetch_config' column on a project. Manifold will now   ")
        logger.info("create new Twitter Query records based on existing project tweet   ")
        logger.info("fetch configs.")
        logger.info("===================================================================")
        cli_user = User.cli_user
        Project.find_each do |project|
          next unless project.respond_to? :tweet_fetch_config
          next unless project.tweet_fetch_config.dig("following").is_a?(Array)

          project.tweet_fetch_config["following"].each do |following|
            q = project.twitter_queries.create(
              query: build_query(following),
              creator: cli_user
            )
            logger.info "Created new Twitter Query #{q.query}"
          end
        end
      end
      # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

      def build_query(following)
        parts = []
        following.each do |k, v|
          base = case k
                 when "user"
                   "from:"
                 when "hashtag"
                   "#"
                 when "since"
                   "since:"
                 else
                   ""
                 end
          parts.push "#{base}#{v.strip}" unless v.blank?
        end
        parts.join(" ")
      end

    end
  end
end
