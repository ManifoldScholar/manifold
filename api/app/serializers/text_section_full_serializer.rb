# Serializes a Text Section model
class TextSectionFullSerializer < TextSectionSerializer
  meta(partial: false)

  attributes :body_json, :citations
end
