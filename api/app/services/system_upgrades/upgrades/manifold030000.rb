module SystemUpgrades
  module Upgrades
    class Manifold030000 < SystemUpgrades::AbstractVersion
      # rubocop:disable Metrics/AbcSize

      def perform!
        reprocess_text_covers!
      end

      private

      def reprocess_text_covers!
        logger.info("===================================================================")
        logger.info("Reprocessing Text Cover Attachments                                ")
        logger.info("===================================================================")
        logger.info("Prior to version 3.0.0, Manifold did not have multiple versions of ")
        logger.info("a text's cover attachment.  Future text covers will generate styles")
        logger.info("for attachments automatically, but styles need to be generated for ")
        logger.info("existing text covers.                                              ")
        logger.info("===================================================================")

        Text.find_each do |text|
          next unless text.cover_attacher.stored?

          logger.info("Generating cover styles for Text #{text.id}")
          text.update cover: text.cover[:original]
        end
      end

      # rubocop:enable Metrics/AbcSize
    end
  end
end
