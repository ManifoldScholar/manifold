module SystemUpgrades
  module Upgrades
    class Manifold000400 < SystemUpgrades::AbstractVersion

      def perform!
        reindex_records
        update_text_indexes
      end

      private

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
            logger.info("Reindexing #{model.name}...")
            model.reindex
          end
        rescue Faraday::ConnectionFailed
          elastic_connection_error
        end
      end

      # rubocop:disable Metrics/AbcSize
      def update_text_indexes
        logger.info("===================================================================")
        logger.info("Update Text Indexes                                                ")
        logger.info("===================================================================")
        logger.info("Manifold 0.4.0 stores every text_section text node in a table      ")
        logger.info("called searchable_nodes. The contents of this table are indexed by ")
        logger.info("Elasticsearch and used in full-text reader search. As part of this ")
        logger.info("upgrade, Manifold will examine each text section and extract the   ")
        logger.info("text nodes. This may take a few minutes, so please be patient.     ")
        logger.info("===================================================================")
        TextSection.update_text_indexes(logger)
        logger.info("===================================================================")
      end
      # rubocop:enable Metrics/AbcSize

      def elastic_connection_error
        logger.error("                                                                  ")
        logger.error("UPGRADE ERROR: Unable to connect to Elasticsearch                 ")
        logger.error("For this upgrade to complete successfully, Manifold must be able  ")
        logger.error("to reindex all models. Is Elasticsearch running at the location   ")
        logger.error("specified in the .env file?                                       ")
        abort
      end

    end
  end
end
