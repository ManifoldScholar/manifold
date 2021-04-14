module SystemUpgrades
  module Upgrades
    class Manifold060000 < SystemUpgrades::AbstractVersion
      # Models that implement FormattedAttributes as of version 6
      FA_MODEL_NAMES = %w[
        Event
        Feature
        Page
        Project
        ProjectCollection
        Resource
        ResourceCollection
        Settings
        Text
        TextTitle
        Content::MarkdownBlock
        Content::TextsBlock
      ].freeze

      # rubocop:disable Metrics/MethodLength
      def perform!
        migrate_ingestion_uploader_attachments!

        populate_formatted_attribute_caches!
      end

      private

      def migrate_ingestion_uploader_attachments!
        logger.info("===================================================================")
        logger.info("Moving ingestion.source attachment to clean up public/system   .   ")
        logger.info("===================================================================")
        Ingestion.find_each do |ingestion|
          attacher = ingestion.source_attacher
          next unless attacher.stored?

          old_attacher = attacher.dup
          attacher.set(attacher.upload(attacher.file))

          begin
            attacher.persist
            old_attacher.destroy_attached
          rescue Shrine::AttachmentChanged,
                 ActiveRecord::RecordNotFound
            attacher.destroy_attached
          end
        end
      end
      # rubocop:enable Metrics/MethodLength

      def populate_formatted_attribute_caches!
        log_with_separator("Populating database cache for formatted attributes")

        FA_MODEL_NAMES.each do |model_name|
          populate_caches_for! model_name
        end
      end

      def populate_caches_for!(model_name)
        log_with_separator("Populating attribute cache for #{model_name}")

        klass = model_name.constantize

        klass.refresh_all_formatted_attribute_caches!(synchronous: true)
      end

      def log_with_separator(message)
        logger.info("=" * 67)
        logger.info("#{message.ljust(63)}.   ")
        logger.info("=" * 67)
      end
    end
  end
end
