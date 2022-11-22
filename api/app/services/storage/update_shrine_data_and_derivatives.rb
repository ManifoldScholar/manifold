module Storage
  class UpdateShrineDataAndDerivatives

    class << self

      def for_all_classes
        ShrineProperties.fetch.each_key { |klass| for_class(klass) }
      end

      def for_class(klass)
        attributes = ShrineProperties.fetch[symbolify_class(klass)]
        attributes.each { |attribute| for_class_and_attribute(klass, attribute) }
      end

      def for_class_and_attribute(klass, attribute)
        constantize_class(klass).find_each { |instance| for_instance_and_attribute(instance, attribute) }
      end

      # rubocop:disable Lint/SuppressedException
      # rubocop:disable Metrics/MethodLength
      def for_instance_and_attribute(instance, attribute)
        attacher = attacher_for(instance, attribute)

        return unless attacher.stored?
        return if address_missing_attachment!(attacher, attribute)

        old_attacher = attacher.dup
        attacher.set(attacher.upload(attacher.file))

        begin
          attacher.persist
          old_attacher.destroy_attached
          if attacher.respond_to? :create_derivatives
            Attachments::ProcessAttachmentJob.perform_later(
              attacher.class.name,
              instance.class.name,
              instance.id, attribute,
              attacher.file_data
            )
          end
        rescue Shrine::AttachmentChanged,
               ActiveRecord::RecordNotFound
          attacher.destroy_attached
        rescue StandardError
        end
      end
      # rubocop:enable Lint/SuppressedException
      # rubocop:enable Metrics/MethodLength

      private

      def address_missing_attachment!(attacher, attribute)
        return false if attacher.file.storage.exists?(attacher.file.id)

        attacher.record.send("#{attribute}=", nil)
        attacher.record.save
        true
      end

      def attacher_for(instance, attribute)
        attacher_method = "#{attribute}_attacher"
        instance.send(attacher_method)
      end

      def symbolify_class(klass)
        stringify_class(klass).to_sym
      end

      def stringify_class(klass)
        return klass if klass.is_a? String
        return klass.name if klass.is_a? Class

        klass.to_s
      end

      def constantize_class(klass)
        klass.is_a?(Class) ? klass : klass.to_s.constantize
      end

    end

  end
end
