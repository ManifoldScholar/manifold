# frozen_string_literal: true

# {Journal}s are a grouping of {JournalIssue}s, optionally grouped by {JournalVolume},
# that contain {Project}s.
#
# @see JournalProjectLink
class Journal < ApplicationRecord
  TYPEAHEAD_ATTRIBUTES = [:title, :maker_names].freeze

  include Authority::Abilities
  include Entitleable
  include TrackedCreator
  include Collaborative
  include SerializedAbilitiesFor
  include Attachments
  include Taggable
  include Metadata
  include HasFormattedAttributes
  include HasSortTitle
  include TruthyChecks
  include Sluggable
  include Filterable
  include SearchIndexable
  include WithPermittedUsers
  include WithProjectCollectionLayout
  include WithConfigurableAvatar

  has_formatted_attributes :description, :subtitle, :image_credits
  has_formatted_attributes :title, include_wrap: false

  with_metadata %w(
    series_title container_title isbn issn doi original_publisher
    original_publisher_place original_title publisher publisher_place version
    series_number edition issue volume rights rights_territory restrictions rights_holder
  )

  has_sort_title do |journal|
    journal.title[/^((a|the|an) )?(?<title>.*)$/i, :title]
  end

  has_many :journal_subjects, dependent: :destroy, inverse_of: :journal
  has_many :subjects, through: :journal_subjects
  has_many :action_callouts,
           -> { order(:position) },
           dependent: :destroy,
           as: :calloutable
  has_many :journal_volumes, -> { in_reverse_order }, dependent: :destroy
  has_many :journal_issues, -> { in_reverse_order },  dependent: :destroy
  has_many :journal_project_links, -> { in_default_order }

  has_many :projects, through: :journal_project_links

  validates :title, presence: true
  validates :draft, inclusion: { in: [true, false] }

  manifold_has_attached_file :logo, :image
  manifold_has_attached_file :social_image, :image

  scope :drafts, -> { where(draft: true) }
  scope :published, -> { where(draft: false) }
  scope :by_draft, ->(draft = nil) { where(draft: to_boolean(draft)) unless draft.nil? }
  scope :with_order, ->(by = nil) do
    case by
    when "updated_at ASC"
      order("journals.updated_at ASC")
    when "updated_at DESC"
      order("journals.updated_at DESC")
    when "created_at ASC"
      order("journals.created_at ASC")
    when "created_at DESC"
      order("journals.created_at DESC")
    when "sort_title ASC"
      order("journals.sort_title ASC, journals.title ASC")
    when "sort_title DESC"
      order("journals.sort_title DESC, journals.title DESC")
    else
      order(:sort_title, :title)
    end
  end
  scope :with_read_ability, ->(user = nil) { build_read_ability_scope_for user }
  scope :by_show_on_homepage, ->(show = true) { where(show_on_homepage: show).order(home_page_priority: :desc) if show.present? }
  scope :with_update_ability, ->(user = nil) { build_update_ability_scope_for user }
  scope :with_update_or_issue_update_ability, ->(user = nil) { build_update_or_issue_update_ability_for user }

  scope :search_import, -> { includes(:collaborators, :makers) }

  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500,
             highlight: [:title, :body])

  def search_data
    {
      search_result_type: search_result_type,
      title: title,
      full_text: description_plaintext,
      creator: creator&.full_name,
      makers: makers.map(&:full_name),
      metadata: metadata.values.reject(&:blank?)
    }.merge(search_hidden)
  end

  def search_hidden
    {
      hidden: draft?
    }
  end

  def to_s
    title
  end

  def recent_journal_volumes
    journal_volumes.in_reverse_order.limit(4)
  end

  def recent_journal_volume_ids
    recent_journal_volumes.pluck(:id)
  end

  def recent_journal_issues
    journal_issues.in_reverse_order.published.limit(8)
  end

  def recent_journal_issue_ids
    recent_journal_issues.pluck(:id)
  end

  def journal_issues_without_volume_count
    journal_issues.where(journal_volume: nil).count
  end

  # This method is named a little oddly, as it actually returns references to projects.
  #
  # It is used in the admin section to allow navigating between project issues that users
  # have access to.
  #
  # @param [User] user
  # @return [<Hash>]
  def issues_nav(user: nil)
    journal_issues.for_nav(user).each_with_object([]) do |issue, entries|
      project = issue.project

      entries << project.to_nav_entry if project.present?
    end
  end

  class << self
    def build_read_ability_scope_for(user = nil)
      return published unless user.present?

      where(arel_build_read_case_statement_for(user))
    end

    # @param [User, nil] user
    # @return [ActiveRecord::Relation<Project>]
    def build_update_ability_scope_for(user = nil)
      return none if user.blank?

      where arel_with_roles_for(user, RoleName.for_journal_update)
    end

    def build_update_or_issue_update_ability_for(user = nil)
      return none if user.blank?

      include_journals = Journal
        .joins(journal_issues: :project)
        .where(journals: {
                 journal_issues: {
                   project: Project.with_update_ability(user)
                 }
               })

      where(arel_with_roles_for(user, RoleName.for_journal_update)).or(where(id: include_journals))
    end

    private

    # This creates a case statement to be supplied to `where`.
    #
    # * If the journal is a draft, only show for users with draft access roles
    #   access to it
    #
    # @param [User, nil] user
    def arel_build_read_case_statement_for(user)
      arel_case.tap do |stmt|
        stmt.when(arel_table[:draft]).then(arel_with_draft_roles_for(user))
        stmt.else(true)
      end
    end

    # @see .arel_with_draft_access_from_issues
    # @see .arel_with_roles_for
    # @param [User] user
    # @return [Arel::Nodes::Or]
    def arel_with_draft_roles_for(user)
      arel_with_roles_for(user, RoleName.for_draft_access).or(
        arel_with_draft_access_from_issues(user)
      )
    end

    # @see RoleName.for_access
    # @param [User] user
    # @param [<Symbol, String>] global role names
    # @param [<Symbol, String>] scoped role names
    # @return [Arel::Nodes::Or]
    def arel_with_roles_for(user, global: [], scoped: [])
      query = unscoped.with_role(scoped, user).unscope(:select).select(primary_key)

      has_global_role = global.any? { |role| user.has_cached_role? role, :any }

      arel_attr_in_query(primary_key, query).or(arel_quote(has_global_role))
    end

    # @param [User] user
    # @return [Arel::Nodes::In]
    def arel_with_draft_access_from_issues(user)
      issue_query = JournalIssue.accessible_journal_ids_for(user)

      arel_attr_in_query(primary_key, issue_query)
    end
  end
end
