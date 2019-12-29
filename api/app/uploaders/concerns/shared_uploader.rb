module Concerns
  # Reduce duplication in uploader classes.
  module SharedUploader
    extend ActiveSupport::Concern

    MANIFOLD_CONFIG = Rails.configuration.manifold

    URL_OPTIONS = {
      host: MANIFOLD_CONFIG.api_url&.sub(%r{\/\z}, "") || ""
    }.freeze

    BETTER_MARCEL = ->(io, *_) do
      Marcel::MimeType.for(io, name: io.path, extension: File.extname(io))
    end

    included do
      plugin :add_metadata
      plugin :default_url_options, cache: URL_OPTIONS, store: URL_OPTIONS

      add_metadata :sha256 do |io, _context|
        calculate_signature(io, :sha256, format: :hex)
      end
    end
  end
end
