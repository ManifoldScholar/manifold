# Events are things that happen in relation to a project. Events populate the project
# activity feed.
class Event < ApplicationRecord

  # Constants
  PROJECT_CREATED = "PROJECT_CREATED".freeze
  RESOURCE_ADDED = "RESOURCE_ADDED".freeze
  TEXT_ADDED = "TEXT_ADDED".freeze
  TEXT_ANNOTATED = "TEXT_ANNOTATED".freeze
  TWEET = "TWEET".freeze
  EVENT_TYPES = [
    PROJECT_CREATED,
    RESOURCE_ADDED,
    TEXT_ADDED,
    TEXT_ANNOTATED,
    TWEET
  ].freeze
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Concerns
  include Filterable
  include Concerns::HasFormattedAttributes

  has_formatted_attribute :subject_title

  # Associations
  belongs_to :subject, polymorphic: true, counter_cache: true
  belongs_to :twitter_query, optional: true
  belongs_to :project

  delegate :slug, to: :project, prefix: true

  # Scopes
  scope :by_type, lambda { |type|
    return all unless type.present?
    where(event_type: type)
  }

  # Validation
  validates :event_type, presence: true, inclusion: { in: self::EVENT_TYPES }

  # Search
  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500,
             highlight: [:title])

  scope :search_import, -> { includes(:project) }

  def search_data
    {
      title: subject_title_formatted,
      body: attribution_name,
      project_id: project&.id,
      project_title: project.title
    }.merge(search_hidden)
  end

  def search_hidden
    project.present? ? project.search_hidden : { hidden: true }
  end

  def self.trigger(type, subject)
    CreateEventJob.perform_later(
      type,
      subject_id: subject.id,
      subject_type: subject.class.name
    )
  end

  def self.trigger_now(type, subject)
    CreateEventJob.perform(
      type,
      subject_id: subject.id,
      subject_type: subject.class.name
    )
  end

  def self.event_exists?(type, project, _subject)
    !::Event.find_by(
      event_type: type,
      project: project,
      subject: project
    ).nil?
  end

  def subject_slug
    sluggables = %w(Project Resource Text ResourceCollection)
    return nil unless sluggables.include? subject_type
    return subject.slug if subject && subject.respond_to?(:slug)
    nil
  end

  def to_s
    "event #{id}"
  end

end
