# A collection of resources
class ResourceCollection < ApplicationRecord

  include HasFormattedAttributes

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  # Concerns
  include Collectable
  include Filterable
  include Attachments
  include Authority::Abilities
  include Sluggable
  include SerializedAbilitiesFor
  include SearchIndexable

  self.authorizer_name = "ProjectChildAuthorizer"

  # PaperTrail
  has_paper_trail meta: {
    parent_item_id: :project_id,
    parent_item_type: "Project"
  }

  # Associations
  belongs_to :project, counter_cache: true
  has_many :collection_resources,
           dependent: :destroy
  has_many :resources, through: :collection_resources
  has_many :annotations, dependent: :destroy
  has_one :collection_created_event,
          -> { where event_type: EventType[:resource_collection_added] },
          class_name: "Event",
          as: :subject,
          dependent: :destroy,
          inverse_of: :subject
  delegate :slug, to: :project, prefix: true
  has_formatted_attributes :title,
                           include_wrap: false
  has_formatted_attribute :description

  # Attachments
  manifold_has_attached_file :thumbnail, :image

  # Validations
  validates :title, presence: true

  # Scopes
  scope :with_order, lambda { |by|
    return order(:title) unless by.present?

    order(by)
  }

  # Search
  searchkick(callbacks: :async,
             batch_size: 500,
             word_start: TYPEAHEAD_ATTRIBUTES,
             highlight: [:title, :body])

  scope :search_import, -> { includes(:project) }

  # Callbacks
  after_commit :trigger_creation_event, on: [:create]

  def search_data
    {
      search_result_type: search_result_type,
      title: title_plaintext,
      full_text: description_plaintext,
      parent_project: project&.id,
      parent_keywords: [project&.title]
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

  private

  def trigger_creation_event
    Event.trigger(EventType[:resource_collection_added], self)
  end

end
