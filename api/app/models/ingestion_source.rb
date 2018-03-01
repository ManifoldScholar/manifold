# Connects texts to resources that were sources for text sections during ingestion
class IngestionSource < ApplicationRecord

  # Concerns
  include Attachments

  # Authorization
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

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
  manifold_has_attached_file :attachment, :resource, no_styles: true

  def to_s
    "ingestion source #{id}"
  end

end
