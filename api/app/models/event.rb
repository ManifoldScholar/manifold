# Events are things that happen in relation to a project. Events populate the project
# activity feed.
class Event < ApplicationRecord
  PROJECT_CREATED = "PROJECT_CREATED".freeze
  TEXT_ADDED = "TEXT_ADDED".freeze
  TEXT_ANNOTATED = "TEXT_ANNOTATED".freeze

  EVENT_TYPES = [
    PROJECT_CREATED,
    TEXT_ADDED,
    TEXT_ANNOTATED
  ].freeze

  belongs_to :subject, polymorphic: true
  belongs_to :project

  validates :event_type, presence: true, inclusion: { in: self::EVENT_TYPES }

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
end
