module V1
  class JournalIssueSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :number, Types::Integer
    typed_attribute :journal_volume_number, Types::Integer.optional.meta(read_only: true)
    typed_attribute :subtitle, Types::String
    typed_attribute :project_id, Types::String
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_attribute :avatar_color, Types::String.enum("primary", "secondary", "tertiary", "quaternary", "quinary", "sentary")
      .meta(read_only: true)
    typed_attribute :avatar_meta, Types::Hash.meta(read_only: true)
    typed_attribute :avatar_styles, Types::Serializer::Attachment.meta(read_only: true)

    typed_attribute :hero_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :cover_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :avatar_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :project_slug, Types::String.meta(read_only: true)
    typed_attribute :publication_date, Types::DateTime.optional
    typed_attribute :creator_names, Types::String.meta(read_only: true)

    typed_belongs_to :journal_volume, record_type: "journalVolume"
    typed_belongs_to :journal
    typed_belongs_to :project
    typed_has_many :project_content_blocks, serializer: ::V1::ContentBlockSerializer, record_type: "contentBlock"
    typed_has_many :project_texts, serializer: ::V1::TextSerializer, record_type: :text
    typed_has_many :creators, serializer: ::V1::MakerSerializer, record_type: :maker

    when_full do
    end
  end
end
