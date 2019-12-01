module V1
  class ResourceSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithMetadata

    make_partial_by_default

    with_metadata(metadata: false, properties: false, formatted: true)
    with_metadata_if_full(metadata: true, properties: true)

    attributes :alt_text,
               :caption,
               :caption_formatted,
               :caption_plaintext,
               :created_at,
               :external_id,
               :external_type,
               :external_url,
               :kind,
               :minimum_height,
               :minimum_width,
               :pending_slug,
               :pending_sort_title,
               :project_id,
               :project_slug,
               :slug,
               :sort_title,
               :sub_kind,
               :title,
               :title_formatted,
               :title_plaintext

    camelized_attributes :attachment_styles,
                         :variant_poster_styles,
                         :variant_thumbnail_styles

    attributes :downloadable, &:downloadable?

    has_many :collection_resources

    full_attributes :allow_download,
                    :allow_high_res,
                    :attachment_content_type,
                    :attachment_extension,
                    :attachment_file_size,
                    :description,
                    :description_formatted,
                    :description_plaintext,
                    :embed_code,
                    :fingerprint,
                    :high_res_content_type,
                    :high_res_file_name,
                    :high_res_file_size,
                    :high_res_url,
                    :iframe_allow_fullscreen,
                    :tag_list,
                    :transcript_content_type,
                    :transcript_file_name,
                    :transcript_file_size,
                    :translation_content_type,
                    :translation_file_name,
                    :translation_file_size,
                    :updated_at,
                    :variant_format_one_content_type,
                    :variant_format_one_file_name,
                    :variant_format_one_file_size,
                    :variant_format_one_url,
                    :variant_format_two_content_type,
                    :variant_format_two_file_name,
                    :variant_format_two_file_size,
                    :variant_format_two_url,
                    :variant_poster_content_type,
                    :variant_poster_file_name,
                    :variant_poster_file_size,
                    :variant_thumbnail_content_type,
                    :variant_thumbnail_file_name,
                    :variant_thumbnail_file_size,
                    :attachment_file_name
    full_attributes :downloadable_kind, &:downloadable_kind?

    full_attributes :abilities do |object, params|
      abilities(object, params)
    end

    full_has_many :resource_collections
    full_belongs_to :project

  end
end
