# Model representing a page of content
class Page < ApplicationRecord

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor

  # Concerns
  include TrackedCreator
  include Sluggable
  include HasFormattedAttributes
  include ClassyEnum::ActiveRecord

  classy_enum_attr :purpose, class_name: "PagePurpose"

  has_formatted_attribute :body, renderer_options: {
    filter_html: false,
    no_images: false,
    no_links: false,
    no_styles: false,
    hard_wrap: false
  }

  # Scopes
  scope :by_purpose, lambda { |purpose|
    next all unless purpose.present?

    where(purpose: purpose.to_s)
  }

  # Validation
  validates :title, presence: true
  validates :external_link, presence: true, if: :is_external_link?
  validate :policy_purpose_is_unique!

  def slug_candidates
    [:nav_title, :title]
  end

  def to_s
    title
  end

  private

  def policy_purpose_is_unique!
    return true unless policy_page?

    errors.add(:purpose, :in_use) if Page
      .where.not(id: id)
      .by_purpose(purpose)
      .any?
  end

  def policy_page?
    purpose.in? PagePurpose.policy
  end

end
