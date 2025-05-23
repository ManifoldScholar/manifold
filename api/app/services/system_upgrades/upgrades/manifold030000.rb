# frozen_string_literal: true

module SystemUpgrades
  module Upgrades
    class Manifold030000 < SystemUpgrades::AbstractVersion
      def perform!
        reprocess_text_covers!
        scaffold_project_content!
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

          next if text.cover(:small).present?

          begin
            logger.info("Generating cover styles for Text #{text.id}")
            text.update cover: text.cover
          rescue Errno::ENOENT
            logger.warn("The cover file image for Text #{text.id} is missing.")
            logger.warn("  You should clear the cover data in the Manifold backend.")
          end
        end
      end

      def scaffold_project_content!
        logger.info("===================================================================")
        logger.info("Creating Content Blocks for Projects                               ")
        logger.info("===================================================================")
        logger.info("Manifold version 3.0.0 introduces ContentBlocks, which are used to ")
        logger.info("customize the layout of the project detail page. By default a      ")
        logger.info("project is created with a RecentActivityBlock, TextsBlock,         ")
        logger.info("ResourcesBlock, MetadataBlock.  These will be created automatically")
        logger.info("for new projects, but must be added to existing projects manually. ")
        logger.info("===================================================================")

        Project.find_each do |project|
          configuration = {
            recent_activity: true,
            markdown: false,
            multiple_texts: true,
            resources: true,
            metadata: true
          }

          Content::ScaffoldProjectContent.run project: project,
                                              configuration: configuration,
                                              logger: logger
        end
      end
    end
  end
end
