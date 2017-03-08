# Provides a partial serialization of a project model.
class ProjectPartialSerializer < ActiveModel::Serializer
  meta(partial: true)

  attributes :id, :title, :subtitle, :hashtag, :publication_date, :description,
             :avatar_url, :cover_url, :hero_url, :created_at, :updated_at, :featured,
             :purchase_url, :purchase_price_money, :purchase_price_currency,
             :purchase_price, :purchase_version_label, :twitter_id, :instagram_id,
             :facebook_id

  has_many :creators, serializer: MakerSerializer
  has_many :contributors, serializer: MakerSerializer
end
