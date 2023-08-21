module V1
  class JournalIssueSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :number, Types::String
    typed_attribute :journal_volume_number, Types::Integer.optional.meta(read_only: true)
    typed_attribute :project_id, Types::String
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_attribute :avatar_color, Types::String.enum("primary", "secondary", "tertiary", "quaternary", "quinary", "sentary")
      .meta(read_only: true)
    typed_attribute :avatar_meta, Types::Hash.meta(read_only: true)
    typed_attribute :avatar_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :avatar_alt_text, Types::String.optional
    typed_attribute :recently_updated, Types::Bool.meta(read_only: true), &:recently_updated?
    typed_attribute :finished, Types::Bool.meta(read_only: true)
    typed_attribute :draft, Types::Bool.meta(read_only: true)
    typed_attribute :title, Types::String.meta(read_only: true)
    typed_attribute :pending_sort_title, Types::String.optional

    typed_attribute :hero_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :hero_alt_text, Types::String.optional
    typed_attribute :cover_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :cover_alt_text, Types::String.optional
    typed_attribute :project_slug, Types::String.meta(read_only: true)
    typed_attribute :publication_date, Types::DateTime.optional
    typed_attribute :creator_names, Types::String.meta(read_only: true)

    typed_belongs_to :journal_volume, record_type: "journalVolume"
    typed_belongs_to :journal
    typed_belongs_to :project, serializer: ::V1::FullProjectSerializer, record_type: :project
    typed_has_many :content_blocks, serializer: ::V1::ContentBlockSerializer, polymorphic: true
    typed_has_many :texts, serializer: ::V1::TextSerializer
    typed_has_many :text_categories, serializer: ::V1::CategorySerializer, record_type: :category
    typed_has_many :creators, serializer: ::V1::MakerSerializer, record_type: :maker

  end
end
