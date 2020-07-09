class CachedExternalSource < ApplicationRecord
  include ExternalSourceUploader::Attachment.new(:asset)

  classy_enum_attr :kind, enum: "CoreMediaTypeKind", allow_blank: false, default: :unknown

  jsonb_accessor :metadata,
                 source_path: :string,
                 source_name: :string

  upsert_keys %i[url]

  has_many :links, class_name: "CachedExternalSourceLink", dependent: :destroy, inverse_of: :cached_external_source
  has_many :texts, through: :links

  scope :by_kind, ->(kind) { where(kind: kind) }
  scope :by_source_identifier, ->(source_identifier) { where(source_identifier: source_identifier) }
  scope :by_url, ->(url) { where(url: url&.to_s) }

  before_validation :derive_kind!
  before_validation :derive_source_information!

  delegate :should_download?, to: :kind

  validates :content_type, presence: true
  validates :url, :source_identifier, presence: true, uniqueness: true

  # @note Temporarily disabled. May need to revisit fallback downloading.
  def needs_download?
    false && should_download? && has_no_asset?
  end

  # @!attribute [r] source_name
  # The filename used to store the external resource,
  # with a correct extension (since EPub cares about that).
  # @return [String]

  # @!attribute [r] source_path
  # The path used to store the external resource
  # @return [String]

  private

  # @return [void]
  def derive_kind!
    self.kind = CoreMediaTypeKind.match content_type
  end

  # @return [void]
  def derive_source_information!
    self.source_identifier ||= "EXT-#{hashed_url}"

    self.source_name = calculate_source_name
    self.source_path = calculate_source_path
  end

  # @return [String]
  def calculate_source_name
    Utility::EnsureExtension.run! filename: source_identifier, content_type: content_type
  end

  # @return [String]
  def calculate_source_path
    "external/#{kind}/#{source_name}"
  end

  # @return [String]
  def hashed_url
    return "" unless url?

    Digest::SHA256.new.update(url).hexdigest
  end

  class << self
    # @param [String] url
    # @return [CachedExternalSource]
    def fetch(url)
      by_url(url).first_or_initialize
    end
  end
end
# rubocop:enable
