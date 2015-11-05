# A value object representing a text's title.
class TextTitle < ActiveRecord::Base
  KIND_MAIN = "main"
  KIND_SUBTITLE = "subtitle"
  KIND_SHORT = "short"
  KIND_COLLECTION = "collection"
  KIND_EDITION = "edition"
  ALLOWED_KINDS = [KIND_MAIN, KIND_SUBTITLE, KIND_SHORT, KIND_COLLECTION, KIND_EDITION]

  belongs_to :text

  validates :value, presence: true
  validates :kind, inclusion: { in: ALLOWED_KINDS }
end
