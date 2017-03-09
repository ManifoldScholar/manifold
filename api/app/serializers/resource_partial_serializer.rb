# Provides a serialization of a resource model.
class ResourcePartialSerializer < ActiveModel::Serializer
  meta(partial: true)

  attributes :title, :kind, :caption, :alt_text, :title_formatted,
             :caption_formatted, :attachment_styles
end
