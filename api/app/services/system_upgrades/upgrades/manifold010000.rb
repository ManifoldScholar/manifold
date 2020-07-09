module SystemUpgrades
  module Upgrades
    class Manifold010000 < SystemUpgrades::AbstractVersion

      def perform!
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

    end
  end
end
