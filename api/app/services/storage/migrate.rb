module Storage
  class Migrate

    class << self

      def migrate_store_to_mirror
        Storage::ShrineProperties.fetch.each do |klass_name, properties|
          klass = klass_name.to_s.constantize
          klass.find_each do |model|
            Rails.logger.info "Mirroring #{klass_name} #{model.id}..."
            properties.each do |property|
              begin
                attacher = model.send("#{property}_attacher")
                next unless attacher.stored?

                attacher.file.trigger_mirror_upload

                # if using derivatives
                next unless attacher.respond_to? :derivatives

                attacher.map_derivative(attacher.derivatives) do |_, derivative|
                  derivative.trigger_mirror_upload
                end
              rescue Shrine::FileNotFound
              end
            end
          end
        end
      end
    end
  end
end
