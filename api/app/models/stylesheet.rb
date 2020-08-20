require "cssbeautify"

# A stylesheet
class Stylesheet < ApplicationRecord

  # Concerns
  include TrackedCreator

  # Authorization
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Associations
  belongs_to :text
  has_one :project, through: :text
  belongs_to :ingestion_source, optional: true
  has_many :text_section_stylesheets, dependent: :destroy
  has_many :text_sections,
           through: :text_section_stylesheets,
           dependent: :destroy,
           inverse_of: :stylesheets

  # Validations
  validates :name, presence: true

  # Skip changing the raw_styles attribute to preserve hashed_content
  attr_accessor :skip_formatting

  # AR Callbacks
  before_save :beautify_raw, :revalidate, :set_hashed_content, if: :raw_styles_changed?

  # Concerns
  acts_as_list scope: :text_id

  scope :ingested, -> { where(ingested: true) }

  def to_s
    "stylesheet #{id}"
  end

  def revalidate
    self.styles = ::Validator::Stylesheet.new(validator_config).validate(raw_styles)
  end

  def validator_config
    ingested? ? validator_config_ingested : validator_config_user
  end

  def validator_config_ingested
    Rails.configuration.manifold.css_validator.ingested
  end

  def validator_config_user
    Rails.configuration.manifold.css_validator.user
  end

  def user_stylesheet?
    !ingested
  end

  def beautify_raw
    return if skip_formatting

    self.raw_styles = CssBeautify.beautify raw_styles, autosemicolon: true
  rescue StandardError
    nil
  end

  def set_hashed_content
    self.hashed_content = Digest::MD5.hexdigest raw_styles
  end

end
