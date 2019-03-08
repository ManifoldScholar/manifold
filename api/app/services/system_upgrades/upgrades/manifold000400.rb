module SystemUpgrades
  module Upgrades
    class Manifold000400 < SystemUpgrades::AbstractVersion

      def perform!
        reindex_records
        generate_searchable_nodes!
        create_twitter_queries
      end

      private

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def reindex_records
        logger.info("===================================================================")
        logger.info("Reindex All Records                                                ")
        logger.info("===================================================================")
        logger.info("Manifold 0.4.0 includes changes to what model data is indexed. To  ")
        logger.info("accommodate those changes, all records must be reindexed. This may ")
        logger.info("take a few minutes, so now is a good time to make that cup of tea. ")
        logger.info("===================================================================")
        Rails.application.eager_load!
        begin
          Searchkick.models.each do |model|
            if model.name == "SearchableNode"
              logger.info("Skipping #{model.name}...")
            else
              logger.info("Reindexing #{model.name}...")
              model.reindex
            end
          end
        rescue Faraday::ConnectionFailed
          elastic_connection_error
        end
      end

      def generate_searchable_nodes!
        logger.info("===================================================================")
        logger.info("Update Text Indexes                                                ")
        logger.info("===================================================================")
        logger.info("Manifold 0.4.0 stores every text_section text node in a table      ")
        logger.info("called searchable_nodes. The contents of this table are indexed by ")
        logger.info("Elasticsearch and used in full-text reader search. As part of this ")
        logger.info("upgrade, Manifold will examine each text section and extract the   ")
        logger.info("text nodes. This may take a few minutes, so please be patient.     ")
        logger.info("===================================================================")

        TextSection.generate_searchable_nodes!(logger)
      end

      def elastic_connection_error
        logger.error("                                                                  ")
        logger.error("UPGRADE ERROR: Unable to connect to Elasticsearch                 ")
        logger.error("For this upgrade to complete successfully, Manifold must be able  ")
        logger.error("to reindex all models. Is Elasticsearch running at the location   ")
        logger.error("specified in the .env file?                                       ")
        abort
      end

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
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength
    end
  end
end
