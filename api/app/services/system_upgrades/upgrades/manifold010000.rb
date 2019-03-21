module SystemUpgrades
  module Upgrades
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    class Manifold010000 < SystemUpgrades::AbstractVersion

      def perform!
        reindex_records
        delete_creatorless_annotations
      end

      private

      def delete_creatorless_annotations
        logger.info("===================================================================")
        logger.info("Delete Annotations without an author                               ")
        logger.info("===================================================================")
        logger.info("Prior to version 1.0.0, Manifold would not destroy annotations when")
        logger.info("the annotation author was deleted. As part of this upgrade,        ")
        logger.info("authorless annotations will be deleted.                            ")
        logger.info("===================================================================")
        Annotation
          .joins("left join users on users.id = annotations.creator_id")
          .where("users.id is null")
          .destroy_all
      end

      def reindex_records
        logger.info("===================================================================")
        logger.info("Reindex All Records                                                ")
        logger.info("===================================================================")
        logger.info("Manifold 1.0.0 includes changes to what model data is indexed. To  ")
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

    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
  end
end
