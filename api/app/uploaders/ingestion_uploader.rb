class IngestionUploader < TusUploader
  include SharedUploader

  plugin :add_metadata
  plugin :determine_mime_type, analyzer: :marcel
  plugin :validation_helpers

  add_metadata :sha256 do |io, context|
    calculate_signature(io, :sha256, format: :hex) if context[:action] == :cache
  end

  Attacher.validate do
    validations = Rails.configuration.manifold.attachments.validations

    validate_extension_inclusion validations.ingestion.allowed_ext
  end

  class Attachment
    def included(model)
      super

      module_eval <<~RUBY, __FILE__, __LINE__ + 1
      def #{@name}_file_name
        #{@name}&.original_filename
      end

      def #{@name}_path
        #{@name}&.to_io.path
      end
      RUBY
    end

  end

end
