# frozen_string_literal: true

# Issues belong to {Journal}s, and optionally to a {JournalVolume}.
#
# They connect a {Journal} with a {Project}.
class JournalIssue < ApplicationRecord
  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  include Authority::Abilities
  include TrackedCreator
  include SerializedAbilitiesFor
  include Filterable
  include Collectable
  include HasFormattedAttributes
  include SearchIndexable
  include HasSortTitle
  include HasKeywordSearch

  belongs_to :journal, counter_cache: true, inverse_of: :journal_issues
  belongs_to :journal_volume, optional: true, counter_cache: true, inverse_of: :journal_issues

  has_one :project, required: true, inverse_of: :journal_issue, dependent: :destroy
  has_many :project_subjects, through: :project

  validates :number, presence: true

  include TrackedCreator

  has_sort_title :sort_title_candidate

  scope :in_reverse_order, -> { order(sort_title: :desc) }
  scope :in_order, -> { order(sort_title: :asc) }
  scope :published, -> { joins(:project).where("projects.draft": false) }
  scope :by_journal_id, lambda { |journal_id|
    next all unless journal_id.present?

    where(journal_id: journal_id)
  }
  scope :with_volume_is_nil, lambda { |is_nil|
    next all unless is_nil

    where(journal_volume_id: nil)
  }
  scope :by_journal_volume_id, lambda { |journal_volume_id|
    next all unless journal_volume_id.present?

    where(journal_volume_id: journal_volume_id)
  }
  scope :with_update_ability, ->(user = nil) do
    return none if user.blank?

    where(project: Project.with_update_ability(user)).or(where(journal: Journal.with_update_ability(user)))
  end

  scope :with_read_ability, ->(user = nil) do
    build_read_ability_scope_for(user)
  end

  scope :for_nav, ->(user = nil) do
    with_update_ability(user).with_attached_project
  end

  scope :with_attached_project, -> do
    includes(:project).where(id: Project.select(:journal_issue_id))
  end

  scope :with_order, ->(by = nil) do
    case by
    when "updated_at ASC"
      reorder(updated_at: :asc)
    when "updated_at DESC"
      reorder(updated_at: :desc)
    when "created_at ASC"
      reorder(created_at: :asc)
    when "created_at DESC"
      reorder(created_at: :desc)
    when "sort_title ASC"
      reorder(sort_title: :asc)
    when "sort_title DESC"
      reorder(sort_title: :desc)
    else
      in_order
    end
  end

  scope :by_subject, ->(subject = nil) {
    next all unless subject.present?

    joins(:project_subjects)
    .merge(ProjectSubject.by_subject(subject))
    .distinct
  }

  delegate :avatar, to: :project
  delegate :avatar_color, to: :project
  delegate :avatar_meta, to: :project
  delegate :avatar_styles, to: :project
  delegate :avatar_alt_text, to: :project
  delegate :cover_styles, to: :project
  delegate :cover_alt_text, to: :project
  delegate :hero_styles, to: :project
  delegate :hero_alt_text, to: :project
  delegate :publication_date, to: :project
  delegate :description, to: :project
  delegate :tag_list, to: :project
  delegate :hashtag, to: :project
  delegate :description_formatted, to: :project
  delegate :description_plaintext, to: :project
  delegate :slug, to: :project, prefix: true
  delegate :number, to: :journal_volume, prefix: true, allow_nil: true
  delegate :texts, to: :project
  delegate :text_ids, to: :project
  delegate :text_categories, to: :project
  delegate :text_category_ids, to: :project
  delegate :creators, to: :project
  delegate :creator_names, to: :project
  delegate :creator_ids, to: :project
  delegate :makers, to: :project
  delegate :maker_ids, to: :project
  delegate :metadata, to: :project
  delegate :finished, to: :project
  delegate :draft, to: :project
  delegate :marked_for_purge_at, to: :project, prefix: true, allow_nil: true

  has_keyword_search! associated_against: {
    journal: [:title],
    journal_volume: [:number],
    project: [:description]
  }

  multisearch_parent_name :journal

  multisearch_secondary_attr :description_plaintext

  def sort_title_candidate
    pending_sort_title.blank? ? number.to_i : pending_sort_title.to_i
  end

  def multisearch_full_text
    description_plaintext
  end

  def multisearch_keywords
    super.tap do |kw|
      kw.concat(texts.map(&:title))
      kw << hashtag
    end.compact_blank
  end

  def title
    parts = []
    parts.push journal.title
    parts.push "vol. #{journal_volume.number}" if journal_volume.present?
    parts.push "no. #{number}"
    parts.join(", ")
  end

  def updated?
    return false unless updated_at

    updated_at.strftime("%F") != created_at.strftime("%F")
  end

  def recently_updated?
    updated? && updated_at >= 1.week.ago
  end

  def content_blocks
    project.content_blocks.where(type: ["Content::TableOfContentsBlock", "Content::TextsBlock"])
  end

  def content_block_ids
    content_blocks.pluck[:id]
  end

  class << self
    # A {User} with update permissions on a {Project} associated with a {JournalIssue}
    # should be able to see the parent {Journal}.
    #
    # @see Journal.arel_with_draft_access_from_issues
    # @return [ActiveRecord::Relation<JournalIssue>] `SELECT DISTINCT journal_id FROM journal_issues`
    def accessible_journal_ids_for(user)
      reorder(nil).where(project: Project.with_update_ability(user)).distinct.select(:journal_id)
    end

    def build_read_ability_scope_for(user)
      left_outer_joins(:project).joins(:journal).where(arel_build_read_case_statement_for(user))
    end

    # This creates a case statement to be supplied to `where`.
    #
    # * If the journal issue's project OR journal is a draft, only show for users
    #   with draft access roles access to it
    #
    # @param [User, nil] user
    # @return [Arel::Nodes::Case]
    def arel_build_read_case_statement_for(user)
      arel_case.tap do |stmt|
        stmt.when(arel_draft_access).then(arel_with_draft_roles_for(user))
        stmt.else(arel_published_access_for(user))
      end
    end

    def arel_draft_access
      project_draft = arel_grouping(Project.arel_table[:draft].then { _1.not_eq(nil).and(_1.eq(true)) })
      journal_draft = arel_grouping(Journal.arel_table[:draft].then { _1.not_eq(nil).and(_1.eq(true)) })

      project_draft.or(journal_draft)
    end

    def arel_published_access_for(user)
      project_ids = Project.with_read_ability(user).select(:id)
      journal_ids = Journal.with_read_ability(user).select(:id)

      project_access = arel_attr_in_query(Project.arel_table[:id], project_ids)
      journal_access = arel_attr_in_query(arel_table[:journal_id], journal_ids)

      project_access.or(journal_access)
    end

    # @see .arel_with_draft_access_from_issues
    # @see .arel_with_roles_for
    # @param [User] user
    # @return [Arel::Nodes::Or]
    def arel_with_draft_roles_for(user)
      # :nocov:
      return arel_quote(false) unless authorized_user?(user)
      # :nocov:

      Journal.arel_with_draft_roles_for(user)
    end
  end
end
