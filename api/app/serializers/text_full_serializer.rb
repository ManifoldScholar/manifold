# Provides a full serialization of a text model.
class TextFullSerializer < TextSerializer
  include SerializedMetadata

  meta(partial: false)

  attributes :metadata, :metadata_properties, :metadata_formatted,
             :citations, :spine, :sections_map, :abilities,
             :ingestion_source_download_url, :ingestion_external_source_url

  belongs_to :project
  has_many :stylesheets
  has_many :creators
  has_many :contributors
  has_many :text_sections
  has_one :toc_section, serializer: TextSectionFullSerializer

  def ingestion_external_source_url
    return nil unless current_user&.can_update? object

    object.last_finished_ingestion&.external_source_url
  end

  def ingestion_source_download_url
    return nil unless current_user&.can_update? object

    object.last_finished_ingestion&.source_url
  end

  def sections_map
    sections_ids = object.spine & object.text_sections.pluck(:id)
    sections_ids.map { |id| Hash[id: id.to_s, name: object.text_sections.find(id).name] }
  end

end
