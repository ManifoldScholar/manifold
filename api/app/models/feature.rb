# Model representing a home page feature
class Feature < ApplicationRecord

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor

  # Concerns
  include TrackedCreator
  include HasFormattedAttributes
  include Attachments
  include Filterable

  manifold_has_attached_file :background, :image
  manifold_has_attached_file :foreground, :image

  has_formatted_attributes :header, :subheader, include_wrap: false
  has_formatted_attribute :body

  acts_as_list

  # Scopes
  scope :by_home, lambda { |home|
    next all if home.nil?

    where(live: true).order(Arel.sql("RANDOM()")).limit(1)
  }

  def to_s
    header
  end

end
