# A collection of resources
class Collection < ApplicationRecord

  include Concerns::HasFormattedAttributes

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

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

  # Search
  searchkick(callbacks: :async,
             batch_size: 500,
             word_start: TYPEAHEAD_ATTRIBUTES,
             highlight: [:title, :body])

  scope :search_import, -> { includes(:project) }

  def search_data
    {
      title: title,
      body: description,
      project_id: project&.id,
      project_title: project.title
    }.merge(search_hidden)
  end

  def search_hidden
    project.present? ? project.search_hidden : { hidden: true }
  end

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
