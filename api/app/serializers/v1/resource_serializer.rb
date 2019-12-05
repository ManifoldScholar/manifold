module V1
  class ResourceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    metadata(metadata: false, properties: false, formatted: true)

    typed_attribute :alt_text, NilClass
    typed_attribute :caption, NilClass
    typed_attribute :caption_formatted, NilClass
    typed_attribute :caption_plaintext, NilClass
    typed_attribute :created_at, NilClass
    typed_attribute :external_id, NilClass
    typed_attribute :external_type, NilClass
    typed_attribute :external_url, NilClass
    typed_attribute :kind, NilClass
    typed_attribute :minimum_height, NilClass
    typed_attribute :minimum_width, NilClass
    typed_attribute :pending_slug, NilClass
    typed_attribute :pending_sort_title, NilClass
    typed_attribute :project_id, NilClass
    typed_attribute :project_slug, NilClass
    typed_attribute :slug, NilClass
    typed_attribute :sort_title, NilClass
    typed_attribute :sub_kind, NilClass
    typed_attribute :title, NilClass
    typed_attribute :title_formatted, NilClass
    typed_attribute :title_plaintext, NilClass
    typed_attribute :downloadable, NilClass, &:downloadable?

    typed_attribute :attachment_styles, Hash
    typed_attribute :variant_poster_styles, Hash
    typed_attribute :variant_thumbnail_styles, Hash

    typed_has_many :collection_resources

    # rubocop:disable Metrics/BlockLength
    when_full do
      abilities
      metadata(metadata: true, properties: true)

      typed_attribute :allow_download, NilClass
      typed_attribute :allow_high_res, NilClass
      typed_attribute :attachment_content_type, NilClass
      typed_attribute :attachment_extension, NilClass
      typed_attribute :attachment_file_size, NilClass
      typed_attribute :description, NilClass
      typed_attribute :description_formatted, NilClass
      typed_attribute :description_plaintext, NilClass
      typed_attribute :embed_code, NilClass
      typed_attribute :fingerprint, NilClass
      typed_attribute :high_res_content_type, NilClass
      typed_attribute :high_res_file_name, NilClass
      typed_attribute :high_res_file_size, NilClass
      typed_attribute :high_res_url, NilClass
      typed_attribute :iframe_allow_fullscreen, NilClass
      typed_attribute :tag_list, NilClass
      typed_attribute :transcript_content_type, NilClass
      typed_attribute :transcript_file_name, NilClass
      typed_attribute :transcript_file_size, NilClass
      typed_attribute :translation_content_type, NilClass
      typed_attribute :translation_file_name, NilClass
      typed_attribute :translation_file_size, NilClass
      typed_attribute :updated_at, NilClass
      typed_attribute :variant_format_one_content_type, NilClass
      typed_attribute :variant_format_one_file_name, NilClass
      typed_attribute :variant_format_one_file_size, NilClass
      typed_attribute :variant_format_one_url, NilClass
      typed_attribute :variant_format_two_content_type, NilClass
      typed_attribute :variant_format_two_file_name, NilClass
      typed_attribute :variant_format_two_file_size, NilClass
      typed_attribute :variant_format_two_url, NilClass
      typed_attribute :variant_poster_content_type, NilClass
      typed_attribute :variant_poster_file_name, NilClass
      typed_attribute :variant_poster_file_size, NilClass
      typed_attribute :variant_thumbnail_content_type, NilClass
      typed_attribute :variant_thumbnail_file_name, NilClass
      typed_attribute :variant_thumbnail_file_size, NilClass
      typed_attribute :attachment_file_name, NilClass
      typed_attribute :downloadable_kind, NilClass, &:downloadable_kind?

      typed_has_many :resource_collections
      typed_belongs_to :project
    end
    # rubocop:enable Metrics/BlockLength

  end
end
