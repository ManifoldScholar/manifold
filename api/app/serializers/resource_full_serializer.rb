# Provides a full serialization of a resource model.
class ResourceFullSerializer < ResourceSerializer

  include SerializedMetadata

  meta(partial: false)

  attributes :attachment_file_name, :attachment_extension,
             :attachment_content_type, :attachment_file_size, :attachment_updated_at,
             :updated_at, :description_formatted, :description_plaintext,
             :description, :fingerprint, :allow_high_res, :allow_download, :high_res_url,
             :high_res_file_name, :high_res_content_type, :high_res_file_size,
             :high_res_updated_at, :variant_format_one_file_name,
             :variant_format_one_content_type, :variant_format_one_file_size,
             :variant_format_one_updated_at, :variant_format_one_url,
             :variant_format_two_url, :variant_format_two_file_name,
             :variant_format_two_content_type, :variant_format_two_file_size,
             :variant_format_two_updated_at, :variant_thumbnail_file_name,
             :variant_thumbnail_content_type, :variant_thumbnail_file_size,
             :variant_thumbnail_updated_at, :variant_poster_file_name,
             :variant_poster_content_type, :variant_poster_file_size,
             :variant_poster_updated_at, :transcript_file_name,
             :transcript_content_type, :transcript_file_size, :transcript_updated_at,
             :translation_file_name, :translation_content_type, :translation_file_size,
             :translation_updated_at, :embed_code, :iframe_allow_fullscreen,
             :downloadable_kind, :metadata, :metadata_properties, :abilities, :tag_list

  has_many :collections
  belongs_to :project

  def downloadable_kind
    object.downloadable_kind?
  end

end
