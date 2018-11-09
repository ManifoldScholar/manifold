class Tag < ActsAsTaggableOn::Tag
  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include Filterable

  scope :by_kind, lambda { |kind|
    joins(:taggings).where(taggings: { taggable_type: kind }) if kind.present?
  }

  alias_attribute :title, :name

  # Search
  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500)

  def search_data
    {
      title: title
    }
  end

  def to_s
    title
  end
end
