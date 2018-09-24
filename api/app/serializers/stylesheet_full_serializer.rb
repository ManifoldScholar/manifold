# Provides a full serialization of a stylesheet model.
class StylesheetFullSerializer < StylesheetSerializer
  meta(partial: false)

  attributes :raw_styles

  belongs_to :text
  has_many :text_sections

end
