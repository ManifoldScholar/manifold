# Reduce duplication in uploader classes.
module SharedUploader
  extend ActiveSupport::Concern

  MANIFOLD_CONFIG = Rails.configuration.manifold

  IMAGE_MIME_TYPES = Array(MANIFOLD_CONFIG.dig(:attachments, :validations, :image, :allowed_mime))

  URL_OPTIONS = {
    host: MANIFOLD_CONFIG.api_url&.sub(%r{/\z}, "") || ""
  }.freeze

  BETTER_MARCEL = ->(io, analyzers) do
    if io.respond_to? :path
      Marcel::MimeType.for(io, name: io.path, extension: File.extname(io))
    else
      analyzers[:marcel].call(io)
    end
  end

  included do
    plugin :add_metadata
    plugin :url_options, cache: URL_OPTIONS, store: URL_OPTIONS
    # In our specs we often attach files from fixtures. If we let Shrine move them, they're
    # not available for other specs. Our import services also attach files from the file system,
    # which should remain in place after the import runs. Until we sort out these issues, we
    # should copy rather than move files into the cache.
    plugin :upload_options, cache: { move: false }, store: { move: true } if Storage::Factory.store_supports_move?
    plugin :pretty_location

    add_metadata :sha256 do |io, _context|
      calculate_signature(io, :sha256, format: :hex)
    end

    add_metadata :alt_text do |io, _context|
      io.try(:alt_text)
    end

    def generate_location(io, **options)
      identifier = options[:record].public_send(opts[:pretty_location][:identifier])
      parts = nil
      if identifier.blank?
        parts = ["new_record"]
      else
        splittable = identifier.is_a?(Array) ? identifier.first : identifier
        parts = splittable.to_s[0..2].split("")
        parts.push(identifier) unless identifier.is_a? Array
        parts += identifier if identifier.is_a? Array
      end
      pretty_location(io, identifier: parts, **options)
    end
  end
end
