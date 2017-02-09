# Provides a serialization of a resource model.
class ResourcePartialSerializer < ActiveModel::Serializer
  meta(partial: true)

  attributes :title, :kind, :caption, :alt_text, :attachment_url,
             :attachment_thumbnails
end
