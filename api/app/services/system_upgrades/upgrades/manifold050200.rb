module SystemUpgrades
  module Upgrades
    class Manifold050200 < SystemUpgrades::AbstractVersion

      # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
      def perform!
        update_attachments_for_shrine_v3!
      end

      private

      def update_attachments_for_shrine_v3!
        logger.info("===================================================================")
        logger.info("Updating attachment json data fields for Shrine v2 > v3 upgrade.   ")
        logger.info("===================================================================")
        logger.info("See https://shrinerb.com/docs/upgrading-to-3#migrating-versions.   ")
        logger.info("===================================================================")

        Storage::ShrineProperties.fetch.each do |klass_name, properties|
          klass = klass_name.to_s.constantize
          klass.find_each do |model|
            logger.info "Found #{klass_name} #{model.id}..."
            properties.each do |property|
              attacher = model.send("#{property}_attacher")
              logger.info("  - Updating #{property}_data for Shrine v3")
              attacher.write
              attacher.persist
            end
          end
        end
      end
      # rubocop:enable Metrics/AbcSize, Metrics/MethodLength
    end
  end
end
