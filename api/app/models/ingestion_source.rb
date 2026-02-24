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
  include HasKeywordSearch

  self.authorizer_name = "ProjectChildAuthorizer"

  classy_enum_attr :kind, enum: "IngestionSourceKind", allow_blank: false

  manifold_has_attached_file :attachment, :resource

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

  CONFIG = Rails.configuration.manifold.attachments.validations

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
  scope :by_format, ->(format) { filtered_by_file_format(format) }

  has_keyword_search! against: TYPEAHEAD_ATTRIBUTES

  belongs_to :text, inverse_of: :ingestion_sources

  has_one :project, through: :text

  # Delegations
  delegate :source_path_map, to: :text
  delegate *IngestionSourceKind.predicates, to: :kind
  delegate :content_type, to: :attachment, allow_nil: true

  validates :source_identifier, presence: true
  validates :attachment, presence: { on: :from_api }

  def display_name
    read_attribute(:display_name).presence || source_identifier
  end

  def packaging_key
    [
      source_path,
      attachment.try(:original_filename),
      fallback_packaging_name,
    ].compact.first
  end

  def packaging_name
    [
      base_source_path,
      attachment.try(:original_filename),
      fallback_packaging_name,
    ].compact.first
  end

  def packaging_path
    source_path_map.fetch(packaging_key)
  rescue KeyError
    # :nocov:
    proxy_path
    # :nocov:
  end

  def proxy_path
    self.class.proxy_path self
  end

  def to_s
    "ingestion source #{id}"
  end

  private

  def base_source_path
    File.basename(source_path) if source_path?
  end

  def fallback_packaging_name
    ext = ::MIME::Types[content_type].first.try(:extensions).try(:first)

    ["ingestion-source-#{id}", ext].compact.join(?.)
  end

  class << self
    # @param [String] attachment_id
    # @raise [ActiveRecord::RecordNotFound]
    # @return [IngestionSource]
    def find_by_attachment_id(attachment_id)
      by_attachment_id(attachment_id).first!
    end

    # @param [String] format
    # @return [ActiveRecord::Relation]
    def filtered_by_file_format(format)
      return all unless format.present?

      allowed_extensions = CONFIG.fetch(format).allowed_ext

      where_clause = allowed_extensions.map do |ext|
        content_types = ::MIME::Types.select { |mt| mt.extensions.include?(ext) }.map(&:content_type)
        arel_json_get_path_as_text(:attachment_data, :metadata, :mime_type).in(content_types) if content_types.present?
      end.compact

      where_clause.any? ? where(arel_or_expressions(where_clause)) : none
    end

    def proxy_path(ingestion_source)
      Rails.application.routes.url_helpers.api_proxy_ingestion_source_path(
        ingestion_source
      )
    end
  end
end
