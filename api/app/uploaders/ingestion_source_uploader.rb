# @see IngestionSource
class IngestionSourceUploader < Shrine
  include SharedUploader

  plugin :determine_mime_type, analyzer: BETTER_MARCEL
  plugin :validation_helpers
  plugin :backgrounding
  plugin :tempfile

  Attacher.destroy_block do
    Attachments::DestroyAttachmentJob.perform_later(self.class.name, data)
  end

  Attacher.validate do
    validations = MANIFOLD_CONFIG.attachments.validations

    validate_mime_type_inclusion validations.resource.allowed_mime
    validate_extension_inclusion validations.resource.allowed_ext
  end

  class Attachment
    def included(model)
      super

      module_eval <<~RUBY, __FILE__, __LINE__ + 1

      def #{@name}_content_type
        #{@name}&.content_type
      end

      def #{@name}_file_name
        #{@name}&.original_filename
      end

      RUBY
    end
  end

end
