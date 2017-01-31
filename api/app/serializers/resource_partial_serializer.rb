# Provides a serialization of a resource model.
class ResourcePartialSerializer < ActiveModel::Serializer
  attributes :title, :kind, :caption, :alt_text, :attachment_url
end
