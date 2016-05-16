# Serializes a Text Section model
class TextSectionSerializer < TextSectionPartialSerializer
  cache key: "text_section", expires_in: 3.hours
  attributes :body_json
end
