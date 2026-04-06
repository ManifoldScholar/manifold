# frozen_string_literal: true

# A comment is about a subject.
class Comment < ApplicationRecord
  # Closure Tree
  has_closure_tree order: "sort_order", numeric_order: true, dependent: :destroy

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor

  # Concerns
  include FlaggableResource
  include TrackedCreator
  include Filterable
  include SoftDeletable

  # Scopes
  scope :by_creator, ->(creator) { where(creator: creator) }

  scope :by_subject, lambda { |subject|
    next all unless subject.present?

    where(subject_id: subject.id)
  }
  scope :by_ids, lambda { |ids|
    next all unless ids.present?

    where(id: ids)
  }

  scope :with_flags, ->(value = nil) do
    where(arel_table[:unresolved_flags_count].gteq(1)) if value.present?
  end

  scope :with_order, ->(by = nil) do
    case by
    when "created_at ASC"
      reorder(created_at: :asc)
    when "created_at DESC"
      reorder(created_at: :desc)
    when "created_by"
      joins(:creator).reorder(User.arel_table[:last_name].asc)
    when "subject"
      reorder(subject_id: :desc)
    else
      reorder(created: :desc)
    end
  end

  scope :by_keyword, ->(value) { build_keyword_scope(value) if value.present? }

  # Associations
  belongs_to :subject, polymorphic: true, counter_cache: :comments_count
  belongs_to :parent, class_name: "Comment", optional: true, inverse_of: :children,
                      counter_cache: :children_count
  has_many :children, class_name: "Comment", foreign_key: :parent_id, dependent: :destroy,
                      inverse_of: :parent, counter_cache: :children_count
  has_one :comment_created_event, -> { where event_type: EventType[:comment_created] },
          class_name: "Event",
          as: :subject,
          dependent: :destroy,
          inverse_of: :subject

  validates :body, presence: true, spam: { type: "comment" }

  after_commit :enqueue_comment_notifications, on: [:create]
  after_commit :trigger_event_creation, on: [:create]

  def on_resource?
    subject.is_a? Resource
  end

  def on_annotation?
    subject.is_a? Annotation
  end

  # @return [Project, nil]
  def project
    subject.try(:project)
  end

  # @return [String, nil]
  def project_slug
    project.try(:slug)
  end

  # @return [String, nil]
  def subject_title
    subject.try(:title)
  end

  # @return [String, nil]
  def subject_text_title
    subject.try(:text_title)
  end

  # @return [String, nil]
  def subject_text_slug
    subject.try(:text_slug)
  end

  # @return [String, nil]
  def subject_text_section_id
    subject.try(:text_section).try(:id)
  end

  def reply_to_self?
    parent && parent.creator_id == creator_id
  end

  def author_created
    creator.project_author_of? project
  end

  private

  def trigger_event_creation
    return if on_annotation? && subject.respond_to?(:private?) && subject.private?

    Event.trigger(EventType[:comment_created], self)
  end

  def enqueue_comment_notifications
    Notifications::EnqueueCommentNotificationsJob.perform_later id
  end

  class << self
    def build_keyword_scope(value)
      escaped = value.gsub("%", "\\%")

      needle = "%#{escaped}%"

      body_matches = where arel_table[:body].matches(needle)

      creator_matches = left_outer_joins(:creator)
        .where(User.arel_table[:first_name]
        .matches(needle)
        .or(User.arel_table[:last_name]
          .matches(needle)))

      creator_matches.or(body_matches).distinct
    end
  end
end
