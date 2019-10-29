module SystemUpgrades
  module Upgrades
    class Manifold040100 < SystemUpgrades::AbstractVersion
      # rubocop:disable Metrics/AbcSize, Metrics/MethodLength

      def perform!
        update_resource_sort_titles!
      end

      private

      def update_resource_sort_titles!
        logger.info("===================================================================")
        logger.info("Updating Sort Titles                                               ")
        logger.info("===================================================================")
        logger.info("Prior to version 4.0.1, Manifold did not exclude punctuation from  ")
        logger.info("sort titles.                                                       ")
        logger.info("===================================================================")
        Resource.all.each(&:update_sort_title!)
        Project.all.each(&:update_sort_title!)
      end

      # rubocop:enable Metrics/AbcSize, Metrics/MethodLength
    end
  end
end
