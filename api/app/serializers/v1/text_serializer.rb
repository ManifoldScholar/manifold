module V1
  class TextSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    typed_attribute :title, NilClass
    typed_attribute :creator_names, NilClass
    typed_attribute :created_at, NilClass
    typed_attribute :updated_at, NilClass
    typed_attribute :published, NilClass
    typed_attribute :annotations_count, NilClass
    typed_attribute :highlights_count, NilClass
    typed_attribute :age, NilClass
    typed_attribute :position, NilClass
    typed_attribute :publication_date, NilClass
    typed_attribute :subtitle, NilClass
    typed_attribute :slug, NilClass
    typed_attribute :description, NilClass
    typed_attribute :title_formatted, NilClass
    typed_attribute :title_plaintext, NilClass
    typed_attribute :subtitle_formatted, NilClass
    typed_attribute :subtitle_plaintext, NilClass
    typed_attribute :description_formatted, NilClass
    typed_attribute :description_plaintext, NilClass
    typed_attribute :toc, NilClass, if: proc { |object, params|
      next true if full?(params)

      params[:include_toc] && params[:include_toc].include?(object.id)
    }

    typed_attribute :cover_styles, Types::Hash

    typed_belongs_to :category

    when_full do
      metadata(metadata: true, properties: true, formatted: true)

      typed_attribute :start_text_section_id, NilClass, &:calculated_start_text_section_id

      typed_attribute :sections_map, NilClass do |object, _params|
        sections_map(object)
      end

      typed_attribute :ingestion_source_download_url, NilClass do |object, params|
        ingestion_source_download_url(object, params)
      end

      typed_attribute :ingestion_external_source_url, NilClass do |object, params|
        ingestion_external_source_url(object, params)
      end

      typed_attribute :citations, NilClass
      typed_attribute :spine, NilClass
      typed_attribute :pending_slug, NilClass
      typed_attribute :section_kind, NilClass

      typed_belongs_to :project
      typed_has_many :stylesheets
      typed_has_many :creators, serializer: MakerSerializer, record_type: "maker"
      typed_has_many :contributors, serializer: MakerSerializer, record_type: "maker"
      typed_has_many :text_sections
      typed_has_one :toc_section, serializer: TextSectionSerializer, record_type: "text_section"
    end

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
