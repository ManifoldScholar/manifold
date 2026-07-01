# frozen_string_literal: true

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

  # Type-detection predicates mixed into each uploader's +UploadedFile+ so that
  # "is this an image / a pdf?" is answered once, on the object that actually
  # holds the mime type and extension, rather than re-implemented per consumer.
  #
  # A file matches a type when its mime type OR its extension is allowed. The
  # extension check preserves the historical +Regexp.union+ semantics; the mime
  # branch is purely additive.
  module TypePredicates
    VALIDATIONS = MANIFOLD_CONFIG.dig(:attachments, :validations)

    # @return [Boolean]
    def image?
      matches_type? :image
    end

    # @return [Boolean]
    def pdf?
      matches_type? :pdf
    end

    # @param [Symbol, String] type
    # @return [Boolean]
    def matches_type?(type)
      validations = VALIDATIONS[type.to_sym]
      return false if validations.blank?

      mime_type_allowed?(validations[:allowed_mime]) ||
        extension_allowed?(validations[:allowed_ext])
    end

    private

    def mime_type_allowed?(allowed)
      return false if allowed.blank? || mime_type.blank?

      allowed.include? mime_type
    end

    def extension_allowed?(allowed)
      return false if allowed.blank? || extension.blank?

      extension.match? Regexp.union(allowed)
    end
  end

  included do
    self::UploadedFile.include TypePredicates

    plugin :add_metadata
    plugin :url_options, cache: Storage::Factory.url_options, store: Storage::Factory.url_options

    upload_options = { cache: { acl: "public-read" }, store: { acl: "public-read" } }
    # In our specs we often attach files from fixtures. If we let Shrine move them, they're
    # not available for other specs. Our import services also attach files from the file system,
    # which should remain in place after the import runs. Until we sort out these issues, we
    # should copy rather than move files into the cache.
    if Storage::Factory.store_supports_move?
      upload_options[:cache][:move] = false
      upload_options[:store][:move] = true
    end
    plugin :upload_options, **upload_options

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
        parts = splittable.to_s[0..2].chars
        parts.push(identifier) unless identifier.is_a? Array
        parts += identifier if identifier.is_a? Array
      end
      pretty_location(io, identifier: parts, **options)
    end
  end
end
