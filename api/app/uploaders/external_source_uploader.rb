class ExternalSourceUploader < Shrine
  include SharedUploader

  plugin :add_metadata
  plugin :determine_mime_type, analyzer: :marcel
  plugin :validation_helpers
  plugin :backgrounding
  plugin :tempfile

  Attacher.destroy_block do
    Attachments::DestroyAttachmentJob.perform_later(self.class.name, data)
  end

  add_metadata :sha256 do |io, context|
    calculate_signature(io, :sha256, format: :hex) if context[:action] == :cache
  end

  class Attachment
    def included(model)
      super

      module_eval <<~RUBY, __FILE__, __LINE__ + 1

      def has_#{@name}?
        #{@name}.present?
      end

      def has_no_#{@name}?
        #{@name}.blank?
      end

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
