# A collection of resources
class Collection < ApplicationRecord

  include Concerns::HasFormattedAttributes

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  # Search
  searchkick word_start: TYPEAHEAD_ATTRIBUTES, callbacks: :async

  # Concerns
  include Filterable
  include Attachments
  extend FriendlyId

  # Authorization
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  friendly_id :title, use: :slugged

  # Associations
  belongs_to :project
  has_many :collection_resources,
           dependent: :destroy
  has_many :resources, through: :collection_resources
  has_many :annotations, dependent: :destroy

  has_formatted_attributes :title, include_wrap: false

  # Attachments
  manifold_has_attached_file :thumbnail, :image

  # Validations
  validates :title, presence: true

  def resource_kinds
    resources
      .select("resources.kind, collection_resources.position")
      .to_a.pluck(:kind)
      .uniq
  end

  def resource_tags
    resources
      .tag_counts
      .pluck(:name)
  end

  def to_s
    title
  end

end
