class ExportUploader < Shrine
  include Concerns::SharedUploader

  plugin :add_metadata
  plugin :determine_mime_type, analyzer: :marcel
  plugin :pretty_location, class_underscore: true, identifier: :location_identifier
  plugin :validation_helpers

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
      def #{@name}_file_name
        #{@name}&.original_filename
      end

      def #{@name}_path
        #{@name}&.to_io&.path
      end
      RUBY
    end
  end

end
