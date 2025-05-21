# frozen_string_literal: true

class Tag < ActsAsTaggableOn::Tag
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  include Authority::Abilities
  include SerializedAbilitiesFor
  include Filterable
  include SearchIndexable
  include HasKeywordSearch

  scope :by_kind, ->(kind) do
    joins(:taggings).where(taggings: { taggable_type: kind }) if kind.present?
  end

  alias_attribute :title, :name

  has_keyword_search! against: %i[name]

  def to_s
    title
  end
end
