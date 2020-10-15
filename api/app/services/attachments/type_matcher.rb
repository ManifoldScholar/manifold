module Attachments
  class TypeMatcher
    extend Dry::Initializer
    extend Memoist

    param :type, Types::ATTACHMENT_TYPE
    option :allowed_ext, Types::Array.of(Types::String), as: :extensions, default: proc { [] }
    option :allowed_mime, Types::Array.of(Types::String), as: :mime_types, default: proc { [] }

    # @param [AttachmentUploader::UploadedFile] uploaded_file
    # @return [Boolean]
    def call(uploaded_file)
      return false unless uploaded_file.present? && uploaded_file.extension.present?

      uploaded_file.extension.match? pattern
    end

    alias === call
    alias =~ call
    alias match? call

    # @api private
    # @!attribute [r] pattern
    # @return [Regexp]
    memoize def pattern
      Regexp.union(extensions)
    end
  end
end
