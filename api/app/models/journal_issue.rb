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

  belongs_to :journal, counter_cache: true
  belongs_to :journal_volume, optional: true, counter_cache: true

  has_one :project, required: true, inverse_of: :journal_issue, dependent: :destroy

  validates :journal_id, presence: true
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
    where(project: Project.with_read_ability(user)).or(where(journal: Journal.with_update_ability(user)))
  end

  scope :for_nav, ->(user = nil) do
    with_update_ability(user).with_attached_project
  end

  scope :with_attached_project, -> do
    includes(:project).where(id: Project.select(:journal_issue_id))
  end

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

  # Search
  scope :search_import, -> {
    includes(
      :journal,
      :project
    )
  }

  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500,
             highlight: [:title, :body])

  def sort_title_candidate
    pending_sort_title.blank? ? number.to_i : pending_sort_title.to_i
  end

  def search_data
    {
      search_result_type: search_result_type,
      title: title,
      full_text: description_plaintext,
      keywords: (tag_list + texts.map(&:title) + hashtag).reject(&:blank?),
      creator: creator&.full_name,
      makers: makers.map(&:full_name),
      metadata: metadata.values.reject(&:blank?)
    }.merge(search_hidden)
  end

  def search_hidden
    {
      hidden: journal.draft?
    }
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
    updated? && updated_at >= Time.current - 1.week
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
      where(project: Project.with_update_ability(user)).distinct.select(:journal_id)
    end
  end
end
