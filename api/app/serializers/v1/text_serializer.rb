module V1
  class TextSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithMetadata

    with_metadata_if_full(metadata: true, properties: true, formatted: true)
    make_partial_by_default

    attributes :title,
               :creator_names,
               :created_at,
               :updated_at,
               :published,
               :annotations_count,
               :highlights_count,
               :age,
               :position,
               :publication_date,
               :subtitle,
               :slug,
               :description,
               :title_formatted,
               :title_plaintext,
               :subtitle_formatted,
               :subtitle_plaintext,
               :description_formatted,
               :description_plaintext

    attributes :toc, if: proc { |object, params|
      next true if full?(params)

      params[:include_toc] && params[:include_toc].include?(object.id)
    }

    camelized_attributes :cover_styles

    belongs_to :category

    full_attributes :start_text_section_id, &:calculated_start_text_section_id

    full_attributes :sections_map do |object, _params|
      sections_map(object)
    end

    full_attributes :abilities do |object, params|
      abilities(object, params)
    end

    full_attributes :ingestion_source_download_url do |object, params|
      ingestion_source_download_url(object, params)
    end

    full_attributes :ingestion_external_source_url do |object, params|
      ingestion_external_source_url(object, params)
    end

    full_attributes :citations,
                    :spine,
                    :pending_slug,
                    :section_kind

    full_belongs_to :project
    full_has_many :stylesheets
    full_has_many :creators, serializer: MakerSerializer, record_type: "maker"
    full_has_many :contributors, serializer: MakerSerializer, record_type: "maker"
    full_has_many :text_sections
    full_has_one :toc_section, serializer: TextSectionSerializer, record_type: "text_section"

    class << self
      def ingestion_external_source_url(object, params)
        return nil unless current_user_can_update?(object, params)

        object.last_finished_ingestion&.external_source_url
      end

      def sections_map(object)
        sections_ids = object.spine & object.text_sections.pluck(:id)
        sections_ids.map { |id| Hash[id: id.to_s, name: object.text_sections.find(id).name] }
      end

      def ingestion_source_download_url(object, params)
        return nil unless current_user_can_update?(object, params)

        object.last_finished_ingestion&.source_url
      end

    end

  end
end
