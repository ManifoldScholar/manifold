# Serializes a Text Section model
class TextSectionSerializer < TextSectionPartialSerializer
  meta(partial: false)

  cache key: "text_section", expires_in: 3.hours
  attributes :body_json
end
