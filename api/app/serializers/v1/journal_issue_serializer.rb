module V1
  class JournalIssueSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :number, Types::Integer
    typed_attribute :journal_volume_number, Types::Integer.optional.meta(read_only: true)
    typed_attribute :subtitle, Types::String.optional
    typed_attribute :subtitle_formatted, Types::String.meta(read_only: true)
    typed_attribute :subtitle_plaintext, Types::String.meta(read_only: true)
    typed_attribute :project_id, Types::String
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_attribute :avatar_color, Types::String.enum("primary", "secondary", "tertiary", "quaternary", "quinary", "sentary")
      .meta(read_only: true)
    typed_attribute :avatar_meta, Types::Hash.meta(read_only: true)
    typed_attribute :avatar_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :recently_updated, Types::Bool.meta(read_only: true), &:recently_updated?
    typed_attribute :slug, Types::String.meta(read_only: true)
    typed_attribute :finished, Types::String.meta(read_only: true)
    typed_attribute :draft, Types::Bool.meta(read_only: true)

    typed_attribute :hero_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :cover_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :avatar_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :project_slug, Types::String.meta(read_only: true)
    typed_attribute :publication_date, Types::DateTime.optional
    typed_attribute :creator_names, Types::String.meta(read_only: true)

    typed_belongs_to :journal_volume, record_type: "journalVolume"
    typed_belongs_to :journal
    typed_belongs_to :project, serializer: ::V1::FullProjectSerializer, record_type: "project"
    typed_has_many :project_content_blocks, serializer: ::V1::ContentBlockSerializer, record_type: "contentBlock"
    typed_has_many :project_texts, serializer: ::V1::TextSerializer, record_type: :text
    typed_has_many :creators, serializer: ::V1::MakerSerializer, record_type: :maker

    when_full do
      typed_attribute :pending_slug, Types::String
    end
  end
end
