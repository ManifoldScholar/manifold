# Provides a partial serialization of a project model.
class ProjectPartialSerializer < ApplicationSerializer

  meta(partial: true)

  attributes :title, :subtitle, :hashtag, :publication_date, :description,
             :created_at, :updated_at, :featured, :purchase_url, :purchase_price_money,
             :purchase_price_currency, :purchase_price, :purchase_call_to_action,
             :twitter_id, :instagram_id, :facebook_id, :hero_styles, :cover_styles,
             :avatar_styles, :recently_updated, :updated, :description_formatted, :slug,
             :resource_kinds, :resource_tags, :avatar_color, :avatar_meta, :draft,
             :abilities

  has_many :creators, serializer: MakerSerializer
  has_many :contributors, serializer: MakerSerializer

  def recently_updated
    object.recently_updated?
  end

  def updated
    object.updated?
  end

  def resource_tags
    object.resource_tags.sort
  end
end
