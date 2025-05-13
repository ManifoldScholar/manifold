# frozen_string_literal: true

class UploadConfig < ApplicationConfig
  # A pattern that matches a URI that doesn't end in a trailing slash.
  SANS_TRAILING_SLASH = %r{(?<!/)\z}

  attr_config bucket: "manifold-storage", public: false, spaces: false, use_asset_cdn: false

  attr_config :cdn_host, :mapped_host

  delegate :endpoint, :force_path_style, to: :s3

  coerce_types public: :boolean, spaces: :boolean, use_asset_cdn: :boolean

  memoize def asset_host
    return unless use_asset_host?

    cdn_host
  end

  # @return [Aws::S3::Bucket]
  def build_client
    name = bucket

    client = s3.build_s3_client

    Aws::S3::Bucket.new(name:, client:)
  end

  def has_mapped_host?
    endpoint.present? && bucket.present? && force_path_style && mapped_host.present?
  end

  # A combination of {#endpoint} and {#bucket}, with a trailing slash.
  #
  # @return [String]
  memoize def host
    return unless has_mapped_host?

    joined = URI.join mapped_host, bucket

    joined.to_s.sub(SANS_TRAILING_SLASH, ?/)
  end

  # @!attribute [r] s3
  # @return [S3Config]
  memoize def s3
    S3Config.new
  end

  memoize def for_url_options
    base = { host:, public:, }.compact

    cache = { **base }
    store = { **base }

    {
      cache:,
      store:
    }
  end

  def use_asset_host?
    use_asset_cdn? && cdn_host.present?
  end
end
