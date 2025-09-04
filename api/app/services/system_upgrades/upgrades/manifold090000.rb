# frozen_string_literal: true

module SystemUpgrades
  module Upgrades
    class Manifold090000 < SystemUpgrades::AbstractVersion
      def perform!
        remove_orphaned_text_sections!
      end

      private

      def remove_orphaned_text_sections!
        logger.info("===================================================================")
        logger.info("Remove Orphaned Text Sections                                      ")
        logger.info("===================================================================")
        logger.info("In earlier versions of Manifold, it was possible to delete a text  ")
        logger.info("without deleting associated text sections. We can safely delete any")
        logger.info("text sections that do not have a corresponding text.               ")
        logger.info("===================================================================")
        TextSection.where.not(text_id: nil).where.not(text_id: Text.select(:id)).destroy_all
      end
    end
  end
end
