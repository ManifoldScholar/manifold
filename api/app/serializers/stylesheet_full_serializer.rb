# Provides a full serialization of a stylesheet model.
class StylesheetFullSerializer < StylesheetSerializer
  meta(partial: false)

  attributes :raw_styles

end
