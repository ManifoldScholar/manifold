# Serializes a stylesheet model
class StylesheetSerializer < StylesheetPartialSerializer
  meta(partial: false)

  attributes :raw_styles

end
