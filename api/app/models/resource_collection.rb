# frozen_string_literal: true

# A collection of {Resource}s.
class ResourceCollection < ApplicationRecord
  include Attachments
  include Authority::Abilities
  include Collectable
  include Filterable
  include HasFormattedAttributes
  include Sluggable
  include SerializedAbilitiesFor
  include SearchIndexable
  include HasKeywordSearch

  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  has_paper_trail meta: {
    parent_item_id: :project_id,
    parent_item_type: "Project"
  }

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

  manifold_has_attached_file :thumbnail, :image

  validates :title, presence: true

  scope :with_order, lambda { |by|
    return order(:title) unless by.present?

    order(by)
  }

  has_keyword_search!(
    against: %i[title description],
    associated_against: {
      project: %i[title]
    }
  )

  multisearch_parent_name :project

  searchkick(callbacks: :async,
             batch_size: 500,
             word_start: TYPEAHEAD_ATTRIBUTES,
             highlight: [:title, :body])

  scope :search_import, -> { includes(:project) }

  after_commit :trigger_creation_event, on: [:create]

  def search_data
    super.merge(parent_project: project.try(:id))
  end

  def multisearch_title
    title_plaintext
  end

  def multisearch_full_text
    description_plaintext
  end

  def multisearch_parent_keywords
    [project.try(:title)].compact
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
