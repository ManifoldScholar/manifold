module SystemUpgrades
  module Upgrades
    class Manifold060000 < SystemUpgrades::AbstractVersion

      # rubocop:disable Metrics/MethodLength
      def perform!
        migrate_ingestion_uploader_attachments!
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
    end
  end
end
