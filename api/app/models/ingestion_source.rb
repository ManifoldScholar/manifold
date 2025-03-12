# frozen_string_literal: true

# Connects texts to resources that were sources for text sections during ingestion
#
# @see IngestionSourceUploader
class IngestionSource < ApplicationRecord
  TYPEAHEAD_ATTRIBUTES = [:display_name, :source_identifier].freeze

  include Authority::Abilities
  include Filterable
  include SerializedAbilitiesFor
  include SearchIndexable
  include Attachments
  self.authorizer_name = "ProjectChildAuthorizer"

  classy_enum_attr :kind, enum: "IngestionSourceKind", allow_blank: false

  # Attachments
  manifold_has_attached_file :attachment, :resource

  # Constants
  KIND_COVER_IMAGE = "cover_image"
  KIND_NAVIGATION = "navigation"
  KIND_SECTION = "section"
  KIND_PUBLICATION_RESOURCE = "publication_resource"
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
  scope :with_order, ->(by = nil) do
    case by
    when "updated_at ASC"
      order(updated_at: :asc)
    when "updated_at DESC"
      order(updated_at: :desc)
    when "created_at ASC"
      order(created_at: :asc)
    when "created_at DESC"
      order(created_at: :desc)
    when "name"
      order(display_name: :asc)
    else
      order(updated_at: :desc)
    end
  end

  # Search
  pg_search_scope :keyword_search, against: TYPEAHEAD_ATTRIBUTES
  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500)

  # Associations
  belongs_to :text, inverse_of: :ingestion_sources

  # Delegations
  delegate :project, to: :text
  delegate *IngestionSourceKind.predicates, to: :kind
  delegate :content_type, to: :attachment, allow_nil: true

  # Validations
  validates :source_identifier, presence: true
  validates :attachment, presence: { on: :from_api }

  def display_name
    read_attribute(:display_name).presence || source_identifier
  end

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
