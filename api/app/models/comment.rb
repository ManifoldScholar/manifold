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

  delegate :project, to: :subject

  validates :body, presence: true, spam: { type: "comment" }

  after_commit :enqueue_comment_notifications, on: [:create]
  after_commit :trigger_event_creation, on: [:create]

  def on_resource?
    subject.is_a? Resource
  end

  def on_annotation?
    subject.is_a? Annotation
  end

  def subject_title
    subject.title if subject.respond_to? :title
  end

  def subject_text_title
    subject.text_title if subject.respond_to? :text_title
  end

  def reply_to_self?
    parent && parent.creator_id == creator_id
  end

  def flagged_by?(user)
    flags.where(creator: user).count.positive?
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
end
