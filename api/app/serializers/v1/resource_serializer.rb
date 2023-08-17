module V1
  class ResourceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    metadata(metadata: false, properties: false, formatted: true)

    typed_attribute :alt_text, Types::String.optional
    typed_attribute :caption, Types::String.optional
    typed_attribute :caption_formatted, Types::String.meta(read_only: true)
    typed_attribute :caption_plaintext, Types::String.meta(read_only: true)
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :external_id, Types::String.optional
    typed_attribute :external_type, Types::String.optional
    typed_attribute :external_url, Types::Serializer::URL
    typed_attribute :kind, Types::String.enum("link")
    typed_attribute :minimum_height, Types::String.optional
    typed_attribute :minimum_width, Types::String.optional
    typed_attribute :pending_slug, Types::String
    typed_attribute :pending_sort_title, Types::String.optional
    typed_attribute :project_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :project_slug, Types::String.meta(read_only: true)
    typed_attribute :slug, Types::String.meta(read_only: true)
    typed_attribute :sort_title, Types::String.meta(read_only: true)
    typed_attribute :sub_kind, Types::String.optional
    typed_attribute :title, Types::String
    typed_attribute :title_formatted, Types::String.meta(read_only: true)
    typed_attribute :title_plaintext, Types::String.meta(read_only: true)
    typed_attribute :downloadable, Types::Bool.meta(read_only: true), &:downloadable?
    typed_attribute :tag_list, Types::Array.of(Types::String)

    typed_attribute :attachment_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :variant_poster_styles, Types::Serializer::Attachment.meta(read_only: true)
    typed_attribute :variant_thumbnail_styles, Types::Serializer::Attachment.meta(read_only: true)

    typed_has_many :collection_resources

    serialize_collectable_attributes!

    when_full do
      abilities
      metadata(metadata: true, properties: true)

      typed_attribute :allow_download, Types::Bool
      typed_attribute :allow_high_res, Types::Bool.meta(read_only: true)
      typed_attribute :attachment_content_type, Types::String.optional.meta(read_only: true)
      typed_attribute :attachment_extension, Types::String.optional.meta(read_only: true)
      typed_attribute :attachment_file_size, Types::String.optional.meta(read_only: true)
      typed_attribute :description, Types::String.optional
      typed_attribute :description_formatted, Types::String.optional.meta(read_only: true)
      typed_attribute :description_plaintext, Types::String.optional.meta(read_only: true)
      typed_attribute :embed_code, Types::String.optional
      typed_attribute :fingerprint, Types::String
      typed_attribute :high_res_content_type, Types::String.optional.meta(read_only: true)
      typed_attribute :high_res_file_name, Types::String.optional.meta(read_only: true)
      typed_attribute :high_res_file_size, Types::String.optional.meta(read_only: true)
      typed_attribute :high_res_url, Types::String.optional.meta(read_only: true)
      typed_attribute :iframe_allows, Types::Array.of(Types::String)
      typed_attribute :transcript_content_type, Types::String.optional.meta(read_only: true)
      typed_attribute :transcript_file_name, Types::String.optional.meta(read_only: true)
      typed_attribute :transcript_file_size, Types::String.optional.meta(read_only: true)
      typed_attribute :translation_content_type, Types::String.optional.meta(read_only: true)
      typed_attribute :translation_file_name, Types::String.optional.meta(read_only: true)
      typed_attribute :translation_file_size, Types::String.optional.meta(read_only: true)
      typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
      typed_attribute :variant_format_one_content_type, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_format_one_file_name, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_format_one_file_size, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_format_one_url, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_format_two_content_type, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_format_two_file_name, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_format_two_file_size, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_format_two_url, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_poster_content_type, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_poster_file_name, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_poster_file_size, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_thumbnail_content_type, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_thumbnail_file_name, Types::String.optional.meta(read_only: true)
      typed_attribute :variant_thumbnail_file_size, Types::String.optional.meta(read_only: true)
      typed_attribute :attachment_file_name, Types::String.optional.meta(read_only: true)
      typed_attribute :downloadable_kind, Types::Bool.meta(read_only: true), &:downloadable_kind?

      typed_has_many :resource_collections
      typed_belongs_to :project
    end
  end
end
