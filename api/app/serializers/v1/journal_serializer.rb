module V1
  class JournalSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :title, Types::String
    typed_attribute :subtitle, Types::String.optional
    typed_attribute :subtitle_formatted, Types::String.meta(read_only: true)
    typed_attribute :subtitle_plaintext, Types::String.meta(read_only: true)
    typed_attribute :title_formatted, Types::String.meta(read_only: true)
    typed_attribute :title_plaintext, Types::String.meta(read_only: true)
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_attribute :slug, Types::String.meta(read_only: true)
    typed_attribute :avatar_color, Types::String.enum("primary", "secondary", "tertiary", "quaternary", "quinary", "sentary")
    typed_attribute :avatar_meta, Types::Hash.meta(read_only: true)
    typed_attribute :draft, Types::Bool
    typed_attribute :avatar_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :tag_list, Types::Array.of(Types::String)
    typed_attribute :journal_issues_count, Types::Integer
    typed_attribute :journal_volumes_count, Types::Integer
    typed_attribute :custom_icon_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :hero_layout, Types::String.enum("square_inset", "wide_inset", "full_bleed")
    typed_attribute :social_description, Types::String.optional
    typed_attribute :social_title, Types::String.optional
    typed_attribute :social_image_styles, Types::Serializer::Attachment.meta(read_only: true)

    typed_has_many :recent_journal_volumes, serializer: ::V1::JournalVolumeSerializer, record_type: :journal_volume
    typed_has_many :recent_journal_issues, serializer: ::V1::JournalIssueSerializer, record_type: :journal_issue

    when_full do
      metadata(metadata: true, properties: true, formatted: true)
      typed_attribute :hero_styles, Types::Serializer::Attachment.meta(read_only: true)
      typed_attribute :cover_styles, Types::Serializer::Attachment.meta(read_only: true)
      typed_attribute :hashtag, Types::String.optional
      typed_attribute :description, Types::String.optional
      typed_attribute :twitter_id, Types::String.optional
      typed_attribute :instagram_id, Types::String.optional
      typed_attribute :facebook_id, Types::String.optional
      typed_attribute :description_formatted, Types::String.meta(read_only: true)
      typed_attribute :image_credits, Types::String.optional
      typed_attribute :image_credits_formatted, Types::String.meta(read_only: true)
      typed_attribute :pending_slug, Types::String

      typed_has_many :journal_volumes, serializer: ::V1::JournalVolumeSerializer, record_type: :journal_volume
      typed_has_many :journal_issues, serializer: ::V1::JournalIssueSerializer, record_type: :journal_issue
      typed_has_many :permitted_users, serializer: ::V1::UserSerializer
      typed_has_many :subjects
    end
  end
end