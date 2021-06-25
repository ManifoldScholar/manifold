class ExportUploader < Shrine
  include SharedUploader

  plugin :add_metadata
  plugin :determine_mime_type, analyzer: :marcel
  plugin :pretty_location, class_underscore: true, identifier: :location_identifier
  plugin :validation_helpers
  plugin :backgrounding
  plugin :tempfile

  Attacher.destroy_block do
    Attachments::DestroyAttachmentJob.perform_later(self.class.name, data)
  end

  add_metadata :sha256 do |io, context|
    calculate_signature(io, :sha256, format: :hex) if context[:action] == :cache
  end

  add_metadata :epubcheck do |io, context|
    if context[:action] == :cache && File.extname(io.path) == ".epub"
      outcome = EpubCheck.run epub_path: io.path

      outcome.result if outcome.valid?
    end
  end

  Attacher.validate do
    validate_extension_inclusion %w[epub]
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
