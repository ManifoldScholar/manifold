class ResourceUploader < Shrine
  MANIFOLD_CONFIG = Rails.configuration.manifold

  plugin :pretty_location
  plugin :module_include
  plugin :determine_mime_type, analyzer: :marcel
  plugin :validation_helpers

  shared_options = {
    host: MANIFOLD_CONFIG.api_url&.sub(%r{\/\z}, "") || ""
  }
  plugin :default_url_options, cache: shared_options, store: shared_options

  Attacher.validate do
    validations = MANIFOLD_CONFIG.attachments.validations

    validate_mime_type_inclusion validations.resource.allowed_mime
    validate_extension_inclusion validations.resource.allowed_ext
  end
end
