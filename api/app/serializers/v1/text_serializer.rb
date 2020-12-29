module V1
  class TextSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    INCLUDE_TOC = proc do |object, params|
      next true if full?(params)

      params[:include_toc] && object.id.in?(params[:include_toc])
    end

    typed_attribute :title, Types::String
    typed_attribute :creator_names, Types::String.meta(read_only: true)
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_attribute :published, Types::Bool
    typed_attribute :annotations_count, Types::Integer.meta(read_only: true)
    typed_attribute :highlights_count, Types::Integer.meta(read_only: true)
    typed_attribute :age, Types::Integer.meta(read_only: true, description: "The age of the resource in days")
    typed_attribute :position, Types::Integer
    typed_attribute :publication_date, Types::DateTime.optional
    typed_attribute :subtitle, Types::String.optional
    typed_attribute :slug, Types::String.meta(read_only: true)
    typed_attribute :description, Types::String.optional
    typed_attribute :ignore_access_restrictions, Types::Bool
    typed_attribute :title_formatted, Types::String.optional.meta(read_only: true)
    typed_attribute :title_plaintext, Types::String.optional.meta(read_only: true)
    typed_attribute :subtitle_formatted, Types::String.optional.meta(read_only: true)
    typed_attribute :subtitle_plaintext, Types::String.optional.meta(read_only: true)
    typed_attribute :description_formatted, Types::String.optional.meta(read_only: true)
    typed_attribute :description_plaintext, Types::String.optional.meta(read_only: true)
    typed_attribute :toc, Types::Array.of(
      Types::Hash.schema(
        label: Types::String,
        anchor: Types::String,
        type: Types::String.optional,
        id: Types::Serializer::ID,
        children: Types::Array.of(
          Types::Hash.schema(
            label: Types::String,
            anchor: Types::String,
            type: Types::String.optional,
            id: Types::Serializer::ID
          )
        )
      )
    ).meta(read_only: true), if: INCLUDE_TOC

    typed_attribute :toc_section_id, Types::String.optional.meta(read_only: true), if: INCLUDE_TOC

    typed_attribute :cover_styles, Types::Serializer::Attachment.meta(read_only: true)

    typed_belongs_to :category

    # rubocop: disable Metrics/BlockLength
    when_full do
      abilities
      metadata(metadata: true, properties: true, formatted: true)

      typed_attribute :start_text_section_id, Types::Serializer::ID.optional.meta(read_only: true), &:calculated_start_text_section_id

      typed_attribute :sections_map, Types::Array.of(
        Types::Hash.schema(
          id: Types::Serializer::ID,
          name: Types::String
        )
      ).meta(read_only: true) do |object, _params|
        sections_map(object)
      end

      typed_attribute :ingestion_source_download_url, Types::Serializer::URL.optional.meta(read_only: true) do |object, params|
        ingestion_source_download_url(object, params)
      end

      typed_attribute :ingestion_external_source_url, Types::Serializer::URL.optional.meta(read_only: true) do |object, params|
        ingestion_external_source_url(object, params)
      end

      typed_attribute :exports_as_epub_v3, Types::Bool.meta(read_only: true)
      typed_attribute :epub_v3_export_url, Types::Serializer::URL.optional.meta(read_only: true), if: ->(object, _params) {
        object.has_epub_v3_export_url?
      }

      typed_attribute :citations, Types::Serializer::Citations
      typed_attribute :spine, Types::Array.of(Types::Serializer::ID).meta(read_only: true)
      typed_attribute :pending_slug, Types::String
      typed_attribute :section_kind, Types::String.optional.meta(
        description: "The label used for sections within the text. "\
        'Values might be, for example, "chapter" or "unit"'
      )

      typed_belongs_to :project
      typed_has_many :stylesheets
      typed_has_many :creators, serializer: MakerSerializer, record_type: "maker"
      typed_has_many :contributors, serializer: MakerSerializer, record_type: "maker"
      typed_has_many :text_sections
      typed_has_one :toc_section, serializer: TextSectionSerializer, record_type: "text_section"
    end
    # rubocop: enable Metrics/BlockLength

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
