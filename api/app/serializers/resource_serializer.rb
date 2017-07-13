# Provides a serialization of a resource model.
class ResourceSerializer < ResourcePartialSerializer
  meta(partial: false)

  attributes :title, :kind, :attachment_file_name, :attachment_extension,
             :attachment_content_type, :attachment_file_size, :attachment_updated_at,
             :updated_at, :project_id, :description_formatted, :description_plaintext,
             :caption, :description, :fingerprint, :alt_text, :keywords,
             :copyright_status, :copyright_holder, :external_url,
             :allow_high_res, :allow_download, :doi, :high_res_url,
             :high_res_file_name, :high_res_content_type, :high_res_file_size,
             :high_res_updated_at, :variant_format_one_file_name,
             :variant_format_one_content_type, :variant_format_one_file_size,
             :variant_format_one_updated_at, :variant_format_two_file_name,
             :variant_format_two_content_type, :variant_format_two_file_size,
             :variant_format_two_updated_at, :variant_thumbnail_styles,
             :variant_thumbnail_file_name, :variant_thumbnail_content_type,
             :variant_thumbnail_file_size, :variant_thumbnail_updated_at,
             :variant_poster_styles, :variant_poster_file_name,
             :variant_poster_content_type, :variant_poster_file_size,
             :variant_poster_updated_at, :transcript_file_name,
             :transcript_content_type, :transcript_file_size, :transcript_updated_at,
             :translation_file_name, :translation_content_type,
             :translation_file_size, :translation_updated_at, :tag_list,
             :embed_code, :iframe_dimensions, :iframe_length, :iframe_width,
             :downloadable_kind

  has_many :collections
  has_many :collection_resources
  belongs_to :project, serializer: ProjectPartialSerializer

  def sub_kind
    object.sub_kind ||= false
  end

  def iframe_length
    return nil unless object.iframe_dimensions
    object.split_iframe_dimensions[0]
  end

  def iframe_width
    return nil unless object.iframe_dimensions
    object.split_iframe_dimensions[1]
  end

  def downloadable_kind
    object.downloadable_kind?
  end
end
