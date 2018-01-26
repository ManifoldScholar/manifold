# Provides a serialization of a resource model.
class ResourcePartialSerializer < ActiveModel::Serializer
  meta(partial: true)

  attributes :title, :title_plaintext, :title_formatted, :kind, :sub_kind, :caption,
             :caption_formatted, :caption_plaintext, :project_id, :alt_text,
             :attachment_styles, :variant_thumbnail_styles, :metadata_formatted,
             :external_type, :external_id, :external_url, :slug, :downloadable,
             :created_at, :minimum_width, :minimum_height, :tag_list, :project_slug,
             :variant_poster_styles

  has_many :collection_resources

  def downloadable
    object.downloadable?
  end
end
