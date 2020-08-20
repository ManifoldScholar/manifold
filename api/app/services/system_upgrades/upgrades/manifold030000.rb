module SystemUpgrades
  module Upgrades
    class Manifold030000 < SystemUpgrades::AbstractVersion
      # rubocop:disable Metrics/AbcSize, Metrics/MethodLength

      def perform!
        reprocess_text_covers!
        scaffold_project_content!
        remove_searchable_node_index!
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

      def remove_searchable_node_index!
        logger.info("===================================================================")
        logger.info("Removing SearchableNode Elasticsearch Index                        ")
        logger.info("===================================================================")
        logger.info("Manifold version 3.0.0 no longer uses SearchableNode records to    ")
        logger.info("query text section body content in Elasticsearch.  As a result of  ")
        logger.info("this change, the SearchableNode index in Elasticsearch is no longer")
        logger.info("needed and can be removed.                                         ")
        logger.info("===================================================================")

        index_name = Rails.env.development? ? "searchable_nodes_development" : "searchable_nodes_production"
        logger.info("Removed #{index_name} index from Elasticsearch.") if Searchkick.client.indices.delete(index: index_name)
      rescue Elasticsearch::Transport::Transport::Errors::NotFound
        logger.info("SearchableNode index not present in Elasticsearch.")
      rescue Faraday::ConnectionFailed
        elastic_connection_error
      end

      # rubocop:enable Metrics/AbcSize, Metrics/MethodLength
    end
  end
end
