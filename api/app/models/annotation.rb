class Annotation < ApplicationRecord

  TYPE_ANNOTATION = "annotation".freeze
  TYPE_HIGHLIGHT = "highlight".freeze

  belongs_to :text_section
  belongs_to :user

end
