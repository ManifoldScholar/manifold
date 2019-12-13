module Attachments
  class Proxy
    extend Dry::Initializer
    extend Memoist

    param :name, Types::ATTRIBUTE_NAME
    param :configuration, Types.Instance(Attachments::Configuration)
    option :record, Types.Instance(Attachments)
    option :uploaded_file, Types.Instance(AttachmentUploader::UploadedFile).optional, optional: true

    delegate :content_type, :local_path, :metadata, :original_filename, to: :uploaded_file, allow_nil: true

    def blank?
      uploaded_file.blank?
    end

    def has_uploaded_file?
      uploaded_file.present?
    end
  end
end
