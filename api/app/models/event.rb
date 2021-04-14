# Events are things that happen in relation to a project. Events populate the project
# activity feed.
class Event < ApplicationRecord

  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  # ClassyEnum
  include ClassyEnum::ActiveRecord
  classy_enum_attr :event_type

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Concerns
  include Filterable
  include HasFormattedAttributes
  include SearchIndexable

  has_formatted_attribute :subject_title

  # Associations
  belongs_to :subject, polymorphic: true, counter_cache: true
  belongs_to :twitter_query, optional: true
  belongs_to :project

  delegate :slug, to: :project, prefix: true

  # Scopes
  scope :created, ->(value) { where(created_at: value) }
  scope :by_type, lambda { |type|
    next all unless type.present?

    where(event_type: type)
  }
  scope :excluding_type, lambda { |type|
    next all unless type.present?

    where.not(event_type: type)
  }
  scope :by_subject_type, lambda { |type|
    next all unless type.present?

    where(subject_type: type)
  }

  # Validation
  validates :event_type, presence: true

  # Search
  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500,
             highlight: [:title])

  scope :search_import, -> { includes(:project) }

  after_commit :touch_project!

  def search_data
    {
      search_result_type: search_result_type,
      title: subject_title_formatted,
      full_text: attribution_name,
      parent_project: project&.id,
      parent_keywords: [
        project&.title
      ]
    }.merge(search_hidden)
  end

  def search_hidden
    project.present? ? project.search_hidden : { hidden: true }
  end

  def self.trigger(type, subject)
    CreateEventJob.perform_later(
      type.to_s,
      subject_id: subject.id,
      subject_type: subject.class.name
    )
  end

  def self.trigger_now(type, subject)
    CreateEventJob.perform(
      type.to_s,
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
    return subject.slug if subject.respond_to?(:slug)

    nil
  end

  def to_s
    "event #{id}"
  end

  private

  def touch_project!
    return unless project.present?
    return unless project.persisted?

    project.touch
  end

end
