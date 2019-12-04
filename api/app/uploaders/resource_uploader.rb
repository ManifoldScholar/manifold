class ResourceUploader < Shrine
  include Concerns::SharedUploader

  plugin :pretty_location

  plugin :module_include

  plugin :determine_mime_type, analyzer: BETTER_MARCEL

  plugin :validation_helpers

  Attacher.validate do
    validations = MANIFOLD_CONFIG.attachments.validations

    validate_mime_type_inclusion validations.resource.allowed_mime
    validate_extension_inclusion validations.resource.allowed_ext
  end
end
