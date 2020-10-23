module Storage
  class Migrate

    class << self

      def migrate_store_to_mirror
        Storage::ShrineProperties.fetch.each do |klass_name, properties|
          klass = klass_name.to_s.constantize
          klass.find_each { |model| migrate_instance_to_mirror(model, properties) }
        end
      end

      private

      def migrate_instance_to_mirror(properties, model)
        Rails.logger.info "Mirroring #{model.name} #{model.id}..."
        properties.each { |property| migrate_model_property_to_mirror(model, property) }
      end

      def migrate_model_property_to_mirror(model, property)
        attacher = model.send("#{property}_attacher")
        return unless attacher.stored?

        attacher.file.trigger_mirror_upload

        # if using derivatives
        return unless attacher.respond_to? :derivatives

        attacher.map_derivative(attacher.derivatives) do |_, derivative|
          derivative.trigger_mirror_upload
        end
      rescue Shrine::FileNotFound
        msg = "Unable to migrate #{model.name}:#{model.id}:#{property} due to Shrine::FileNotFound"
        Rails.logger.warn(msg)
      end

    end
  end
end
