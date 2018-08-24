# A comment is about a subject.
class Comment < ApplicationRecord

  # Closure Tree
  has_closure_tree order: "sort_order", dependent: :destroy

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor

  # Concerns
  include Concerns::FlaggableResource
  include TrackedCreator
  include Filterable

  # Scopes
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
          class_name: Event,
          as: :subject,
          dependent: :destroy,
          inverse_of: :subject
  delegate :project, to: :subject

  # Validations
  validates :body, :subject, presence: true

  # Callbacks
  after_create :notify_parent_authors!, :notify_project_editors!
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

  private

  def trigger_event_creation
    Event.trigger(EventType[:comment_created], self)
  end

  def notify_parent_authors!
    Notifications::NotifyCommentParentAuthorsJob.perform_later self
  end

  def notify_project_editors!
    Notifications::NotifyCommentProjectEditorsJob.perform_later self
  end

end
