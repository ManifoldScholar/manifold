# frozen_string_literal: true

# Events are things that happen in relation to a project. Events populate the project
# activity feed.
class Event < ApplicationRecord
  include Authority::Abilities
  include SerializedAbilitiesFor
  include Filterable
  include HasFormattedAttributes
  include SearchIndexable
  include HasKeywordSearch

  TYPEAHEAD_ATTRIBUTES = %i[title].freeze
  KEYWORD_SEARCH_ATTRIBUTES = %i[subject_title subject_subtitle excerpt].freeze

  self.authorizer_name = "ProjectChildAuthorizer"

  classy_enum_attr :event_type

  has_keyword_search! against: KEYWORD_SEARCH_ATTRIBUTES

  has_formatted_attribute :subject_title

  belongs_to :subject, polymorphic: true, counter_cache: true
  belongs_to :twitter_query, optional: true
  belongs_to :project

  delegate :slug, to: :project, prefix: true

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

  validates :event_type, presence: true

  multisearch_parent_name :project

  after_commit :touch_project!

  def multisearch_title
    subject_title_formatted
  end

  def multisearch_full_text
    attribution_name
  end

  def multisearch_parent_keywords
    [project.try(:title)].compact_blank
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
