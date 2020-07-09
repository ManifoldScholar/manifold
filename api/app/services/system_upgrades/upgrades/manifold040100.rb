module SystemUpgrades
  module Upgrades
    class Manifold040100 < SystemUpgrades::AbstractVersion
      # rubocop:disable Metrics/AbcSize

      def perform!
        remove_collaborators_without_makers!
        update_resource_sort_titles!
        update_project_counters!
        cache_formatted_attributes!
      end

      private

      def remove_collaborators_without_makers!
        logger.info("===================================================================")
        logger.info("Remove Collaborators with Null Makers                              ")
        logger.info("===================================================================")
        logger.info("Prior to version 4.0.1, it was possible to delete a maker without  ")
        logger.info("deleting associated collaborator records. We can safely delete any ")
        logger.info("collaborators that do not have a corresponding maker               ")
        logger.info("===================================================================")
        invalid_collaborators = Collaborator.all.reject(&:maker)
        invalid_collaborators.each { |c| c.destroy if c.maker.nil? }
      end

      def update_project_counters!
        logger.info("===================================================================")
        logger.info("Updating Project Counters                                          ")
        logger.info("===================================================================")
        logger.info("Prior to version 4.0.1, Manifold calculated counts of project      ")
        logger.info("resources on the fly, which was inefficient. Now we cache these    ")
        logger.info("counts.                                                            ")
        logger.info("===================================================================")
        Project.find_each { |p| Project.reset_counters(p.id, :resources) }
        Project.find_each { |p| Project.reset_counters(p.id, :resource_collections) }
      end

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

      def cache_formatted_attributes!
        logger.info("===================================================================")
        logger.info("Cache Formatted Attributes                                         ")
        logger.info("===================================================================")
        logger.info("We now cache some rendered markdown in the database to speed up    ")
        logger.info("very long lists of resources. Prime these caches.                  ")
        logger.info("===================================================================")
        TextTitle.find_each { |tt| tt.update_db_cache_for_formatted_value && tt.save }
        Text.find_each { |t| t.update_db_cache_for_formatted_description && t.save }
        Project.find_each { |t| t.update_db_cache_for_formatted_title && t.save }
        Project.find_each { |t| t.update_db_cache_for_formatted_subtitle && t.save }

        Maker.find_each { |t| t.cache_name && t.save }
      end

      # rubocop:enable Metrics/AbcSize
    end
  end
end
