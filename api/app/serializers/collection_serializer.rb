# Provides a serialization of a collection model.
class CollectionSerializer < ActiveModel::Serializer
  cache key: "collection", expires_in: 3.hours
  attributes :id, :title, :thumbnail_url, :created_month, :created_year, :description,
             :resource_kinds

  has_many :resources

  def created_month
    object.created_at.strftime("%-m")
  end

  def created_year
    object.created_at.strftime("%-Y")
  end


end
