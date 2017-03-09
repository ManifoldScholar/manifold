# Serializes a Text Section model
class TextSectionSerializer < TextSectionPartialSerializer
  meta(partial: false)

  attributes :body_json
end
