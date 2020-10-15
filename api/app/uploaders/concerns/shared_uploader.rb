# Reduce duplication in uploader classes.
module SharedUploader
  extend ActiveSupport::Concern

  MANIFOLD_CONFIG = Rails.configuration.manifold

  IMAGE_MIME_TYPES = Array(MANIFOLD_CONFIG.dig(:attachments, :validations, :image, :allowed_mime))

  URL_OPTIONS = {
    host: MANIFOLD_CONFIG.api_url&.sub(%r{/\z}, "") || ""
  }.freeze

  BETTER_MARCEL = ->(io, *_) do
    Marcel::MimeType.for(io, name: io.path, extension: File.extname(io))
  end

  included do
    plugin :add_metadata
    plugin :url_options, cache: URL_OPTIONS, store: URL_OPTIONS
    # In our specs we often attach files from fixtures. If we let Shrine move them, they're
    # not available for othe specs. Our import services also attach files from the file system,
    # which should remain in place after the import runs. Until we sort out these issues, we
    # should copy rather than move files into the cache.
    plugin :upload_options, cache: { move: false }, store: { move: true } if Storage::Factory.store_supports_move?

    add_metadata :sha256 do |io, _context|
      calculate_signature(io, :sha256, format: :hex)
    end
  end
end
