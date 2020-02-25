# Connects texts to resources that were sources for text sections during ingestion
#
# @see IngestionSourceUploader
class IngestionSource < ApplicationRecord

  # Attachments
  include IngestionSourceUploader::Attachment.new(:attachment)

  # Authorization
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  classy_enum_attr :kind, enum: "IngestionSourceKind", allow_blank: false

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

  scope :by_attachment_id, ->(attachment_id) { where(arel_json_property_eq(:attachment_data, :id, attachment_id)) }
  scope :by_kind, ->(kind) { where(kind: kind) }
  scope :cover_images, -> { by_kind(:cover_image) }
  scope :navigation, -> { by_kind(:navigation) }
  scope :publication_resources, -> { by_kind(:publication_resource) }

  # Associations
  belongs_to :text

  # Delegations
  delegate :project, to: :text
  delegate *IngestionSourceKind.predicates, to: :kind
  delegate :content_type, to: :attachment, allow_nil: true

  # Validations
  validates :source_identifier, presence: true

  class << self
    # @param [String] attachment_id
    # @raise [ActiveRecord::RecordNotFound]
    # @return [IngestionSource]
    def find_by_attachment_id(attachment_id)
      by_attachment_id(attachment_id).first!
    end

    def proxy_path(ingestion_source)
      Rails.application.routes.url_helpers.api_proxy_ingestion_source_path(
        ingestion_source
      )
    end
  end

  def proxy_path
    self.class.proxy_path self
  end

  def to_s
    "ingestion source #{id}"
  end
end
