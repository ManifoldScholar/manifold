# Provides a full serialization of a text section model.
class TextSectionFullSerializer < TextSectionSerializer
  meta(partial: false)

  attributes :body_json, :citations
end
