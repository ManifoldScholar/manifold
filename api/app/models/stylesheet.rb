# A stylesheet
class Stylesheet < ApplicationRecord

  include Authority::Abilities
  include TrackedCreator

  # Associations
  belongs_to :text
  belongs_to :ingestion_source, optional: true

  # Validations
  validates :name, presence: true

  # AR Callbacks
  before_save :revalidate, if: :raw_styles_changed?

  # Concerns
  acts_as_list scope: :text_id

  def to_s
    "stylesheet #{id}"
  end

  def revalidate
    self.styles = ::Validator::Stylesheet.new.validate(raw_styles)
  end

end
