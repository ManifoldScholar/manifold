# Provides a serialization of a resource model.
class ReaderSearchResultSerializer < ApplicationSerializer

  meta(partial: false)

  attributes :score, :searchable_type, :searchable_id, :body, :highlighted_body,
             :node_uuid

  has_one :creator, serializer: UserSerializer
  has_one :text_section, serializer: TextSectionPartialSerializer
  has_one :annotation, serializer: AnnotationSerializer

  def read_attribute_for_serialization(attr)
    if respond_to?(attr)
      send(attr)
    else
      object[attr.to_s]
    end
  end

  def _type
    "search_result"
    # object._type
  end

  def searchable_id
    object._id
  end

  def searchable_type
    object._type.camelize(:lower)
  end

  def score
    object._score
  end

end
