# Model representing a page of content
class Page < ApplicationRecord

  # Authority
  include Authority::Abilities

  # Concerns
  include FriendlyId
  include TrackedCreator
  include Concerns::HasFormattedAttributes

  has_formatted_attribute :body, renderer_options: {
    filter_html: false,
    no_images: false,
    no_links: false,
    no_styles: false,
    hard_wrap: false
  }

  # Validation
  validates :title, presence: true
  validates :slug, presence: true, uniqueness: true

  # Misc
  friendly_id :slug_candidates, use: :slugged

  def slug_candidates
    [:nav_title, :title]
  end

  def to_s
    title
  end

end
