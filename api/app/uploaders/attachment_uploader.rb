class AttachmentUploader < Shrine
  MANIFOLD_CONFIG = Rails.configuration.manifold

  plugin :backgrounding
  plugin :validation_helpers
  plugin :processing
  plugin :versions
  plugin :pretty_location
  plugin :delete_promoted
  plugin :determine_mime_type, analyzer: :marcel
  plugin :store_dimensions, analyzer: lambda { |io, analyzers|
    mime_type = determine_mime_type(io)
    return nil unless mime_type && MANIFOLD_CONFIG.attachments
                                                  .validations[:image][:allowed_mime]
                                                  .include?(mime_type)
    analyzers[:mini_magick].call io
  }

  shared_options = {
    host: MANIFOLD_CONFIG.api_url&.sub(%r{\/\z}, "") || ""
  }
  plugin :default_url_options, cache: shared_options, store: shared_options

  Attacher.promote { |data| Attachments::ProcessAttachmentJob.perform_later data }

  Attacher.validate do
    attachment_options = record.__send__("#{name}_options")
    attachment_validation = MANIFOLD_CONFIG.attachments
                                           .validations[attachment_options[:type]]

    if attachment_options[:validate_content_type]
      validate_mime_type_inclusion attachment_validation[:allowed_mime]
    end

    validate_extension_inclusion attachment_validation[:allowed_ext]
  end

  process(:store) do |io, context|
    attachment_options = context[:record].__send__("#{context[:name]}_options")
    Attachments::Processor.run!(upload: io,
                                model: context[:record],
                                attachment_options: attachment_options)
  end
end
