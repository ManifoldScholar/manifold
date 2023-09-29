# @see Attachments
class AttachmentUploader < Shrine
  include SharedUploader

  plugin :backgrounding
  plugin :validation_helpers
  plugin :tempfile
  plugin :derivatives, versions_compatibility: true
  plugin :remote_url, max_size: 20 * 1024 * 1024
  plugin :determine_mime_type, analyzer: BETTER_MARCEL
  plugin :store_dimensions, analyzer: lambda { |io, analyzers|
    mime_type = determine_mime_type(io)

    return nil unless mime_type.in?(IMAGE_MIME_TYPES)

    analyzers[:mini_magick].call io
  }

  Attacher.promote_block do
    conf = record.shrine_configuration_for name
    message = conf.backgrounding || Rails.env.test? ? :perform_later : :perform_now
    Attachments::ProcessAttachmentJob.send(message, self.class.name, record.class.name, record.id, name, file_data)
  end

  Attacher.destroy_block do
    conf = record.shrine_configuration_for name
    message = conf.backgrounding || Rails.env.test? ? :perform_later : :perform_now
    Attachments::DestroyAttachmentJob.send(message, self.class.name, data)
  end

  Attacher.validate do
    conf = record.shrine_configuration_for name

    validate_mime_type_inclusion conf.validations.allowed_mime if conf.validate_content_type

    # In the test environment, we use a Shrine memory store as our cache store. This store
    # does not handle file extensions correctly, since it deals in StringIO instances.
    validate_extension_inclusion conf.validations.allowed_ext unless Rails.env.test?
  end

  Attacher.derivatives_processor do |file_resource|
    attachment_options = context[:record].shrine_options_for context[:name]
    outcome = Attachments::Processor.run!(
      shrine_uploaded_file: file,
      file_resource: file_resource,
      model: context[:record],
      attachment_options: attachment_options
    )
    outcome
  end

  class Attachment
    def initialize(*)
      super

      module_eval <<~RUBY, __FILE__, __LINE__ + 1

      def #{@name}_configuration
        shrine_configuration_for(#{@name.inspect})
      end

      def #{@name}_options
        shrine_options_for(#{@name.inspect})
      end

      def #{@name}_style_keys
        shrine_attachment_style_keys_for(#{@name.inspect})
      end

      def #{@name}_processed?
        #{@name}_attacher.stored?
      end

      def show_#{@name}_placeholder?
        return false unless #{@name}_is_image?
        return false if #{@name}_processed?
        true
      end

      def #{@name}_placeholder(style)
        shrine_image_placeholder_for(style)
      end

      def #{@name}_versions?
        #{@name}_derivatives.is_a? Hash
      end

      def #{@name}_checksum
        #{@name}_original(&:sha256)
      end

      def #{@name}_extension
        #{@name}_original(&:extension)
      end

      def #{@name}_file_name
        #{@name}_original(&:original_filename)
      end

      def #{@name}?
        #{@name}.present?
      end

      def #{@name}_url
        #{@name}_original(&:url)
      end

      def #{@name}_content_type
        #{@name}_original(&:mime_type)
      end

      def #{@name}_file_size
        #{@name}_original(&:size)
      end

      def #{@name}_original(&block)
        shrine_original_for #{@name.inspect}, &block
      end

      def #{@name}_meta
        shrine_meta_for #{@name.inspect}
      end

      def #{@name}_styles
        shrine_styles_for #{@name.inspect}
      end

      def #{@name}_is_image?
        shrine_upload_matches_type?(#{@name}_original, type: :image)
      end

      def #{@name}_is_video?
        shrine_upload_matches_type?(#{@name}_original, type: :video)
      end

      def #{@name}_is_audio?
        shrine_upload_matches_type?(#{@name}_original, type: :audio)
      end

      def #{@name}_is_spreadsheet?
        shrine_upload_matches_type?(#{@name}_original, type: :spreadsheet)
      end

      def #{@name}_is_text_document?
        shrine_upload_matches_type?(#{@name}_original, type: :text_document)
      end

      def #{@name}_is_presentation?
        shrine_upload_matches_type?(#{@name}_original, type: :presentation)
      end

      def #{@name}_is_pdf?
        shrine_upload_matches_type?(#{@name}_original, type: :pdf)
      end

      RUBY
    end
  end

  class UploadedFile
    def as_dimensions_hash
      { width: width, height: height }
    end

    def local_path
      to_io&.path
    end
  end

end
