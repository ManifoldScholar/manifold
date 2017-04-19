# Provides a partial serialization of a project model.
class ProjectPartialSerializer < ActiveModel::Serializer
  meta(partial: true)

  attributes :id, :title, :subtitle, :hashtag, :publication_date, :description,
             :created_at, :updated_at, :featured, :purchase_url, :purchase_price_money,
             :purchase_price_currency, :purchase_price, :purchase_version_label,
             :twitter_id, :instagram_id, :facebook_id, :hero_styles, :cover_styles,
             :avatar_styles, :recently_updated, :updated, :description_formatted,
             :resource_kinds, :resource_tags, :avatar_color

  has_many :creators, serializer: MakerSerializer
  has_many :contributors, serializer: MakerSerializer

  def recently_updated
    object.recently_updated?
  end

  def updated
    object.updated?
  end
end
