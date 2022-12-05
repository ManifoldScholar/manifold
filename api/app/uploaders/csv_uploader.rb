# frozen_string_literal: true

# An uploader for handling CSV files.
class CSVUploader < Shrine
  include SharedUploader

  plugin :add_metadata
  plugin :tempfile
  plugin :determine_mime_type, analyzer: :marcel, analyzer_options: { filename_fallback: true }
  plugin :pretty_location, class_underscore: true
  plugin :validation_helpers

  add_metadata :sha256 do |io, context|
    calculate_signature(io, :sha256, format: :hex) if context[:action] == :cache
  end

  Attacher.validate do
    validate_mime_type_inclusion %w[text/csv]
  end

  class Attachment
    def included(base)
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
