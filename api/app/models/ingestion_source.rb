# Connects texts to resources that were sources for text sections during ingestion
class IngestionSource < ApplicationRecord

  # Authority
  include Authority::Abilities

  # Constants
  KIND_COVER_IMAGE = "cover_image".freeze
  KIND_NAVIGATION = "navigation".freeze
  KIND_SECTION = "section".freeze
  KIND_PUBLICATION_RESOURCE = "publication_resource".freeze
  ALLOWED_KINDS = [
    KIND_COVER_IMAGE,
    KIND_NAVIGATION,
    KIND_SECTION,
    KIND_PUBLICATION_RESOURCE
  ].freeze

  # Associations
  belongs_to :text

  # Delegations
  delegate :project, to: :text

  # Validations
  validates :source_identifier, presence: true
  validates :kind, inclusion: { in: ALLOWED_KINDS }

  # Attachments
  has_attached_file :attachment
  validation = Rails.configuration.manifold.attachments.validations.resource
  validates_attachment_content_type :attachment, content_type: validation[:allowed_mime]
  validates_attachment_file_name :attachment, matches: validation[:allowed_ext]

  def to_s
    "ingestion source #{id}"
  end

  def attachment_url
    return nil if attachment.url.blank?
    Rails.configuration.manifold.api_url + attachment.url
  end

end
