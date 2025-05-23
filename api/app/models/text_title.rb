# frozen_string_literal: true

# A value object representing a text's title.
class TextTitle < ApplicationRecord
  # Constants
  KIND_MAIN = "main"
  KIND_ACRONYM = "acronym"
  KIND_ABBREVIATED = "abbreviated"
  KIND_ALTERNATIVE = "alternative"
  KIND_EXPANDED = "expanded"
  KIND_FORMER = "former"
  KIND_ALTERNATIVE_COVER = "alternative_cover"
  KIND_ALTERNATIVE_BACK = "alternative_back"
  KIND_TRANSLATED = "translated"
  KIND_SUBTITLE = "subtitle"
  KIND_SHORT = "short"
  KIND_COLLECTION = "collection"
  KIND_EDITION = "edition"
  ALLOWED_KINDS = [KIND_MAIN,
                   KIND_ACRONYM,
                   KIND_ABBREVIATED,
                   KIND_ALTERNATIVE,
                   KIND_ALTERNATIVE_COVER,
                   KIND_ALTERNATIVE_BACK,
                   KIND_EXPANDED,
                   KIND_FORMER,
                   KIND_TRANSLATED,
                   KIND_SUBTITLE,
                   KIND_SHORT,
                   KIND_COLLECTION,
                   KIND_EDITION].freeze

  alias_attribute :title, :value
  alias_attribute :subtitle, :value
  alias_attribute :title_formatted, :value_formatted
  alias_attribute :subtitle_formatted, :value_formatted
  alias_attribute :title_plaintext, :value_plaintext
  alias_attribute :subtitle_plaintext, :value_plaintext

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  include HasFormattedAttributes
  has_formatted_attributes :value, include_wrap: false

  # Associations
  belongs_to :text

  # Validation
  validates :value, presence: true
  validates :kind, inclusion: { in: ALLOWED_KINDS }

  def to_s
    value
  end

  def packaging_metadata
    slice(:title, :kind).compact
  end
end
