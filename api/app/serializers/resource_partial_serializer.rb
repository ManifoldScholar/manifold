# Provides a serialization of a resource model.
class ResourcePartialSerializer < ActiveModel::Serializer
  meta(partial: true)

  attributes :title, :kind, :sub_kind, :caption, :alt_text, :title_formatted, :project_id,
             :caption_formatted, :attachment_styles, :variant_thumbnail_styles,
             :credit_formatted, :credit, :external_type, :external_id, :slug,
             :downloadable, :created_at

  has_many :collection_resources
  has_many :collection_resources

  def downloadable
    object.downloadable?
  end
end
