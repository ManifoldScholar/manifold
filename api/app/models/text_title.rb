# A value object representing a text's title.
class TextTitle < ActiveRecord::Base
  KIND_MAIN = "main".freeze
  KIND_SUBTITLE = "subtitle".freeze
  KIND_SHORT = "short".freeze
  KIND_COLLECTION = "collection".freeze
  KIND_EDITION = "edition".freeze
  ALLOWED_KINDS = [KIND_MAIN,
                   KIND_SUBTITLE,
                   KIND_SHORT,
                   KIND_COLLECTION,
                   KIND_EDITION
  ].freeze

  belongs_to :text

  validates :value, presence: true
  validates :kind, inclusion: { in: ALLOWED_KINDS }
end
