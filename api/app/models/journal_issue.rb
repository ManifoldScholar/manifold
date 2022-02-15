require "securerandom"

# Volumes belong to Journals
class JournalIssue < ApplicationRecord

  TYPEAHEAD_ATTRIBUTES = [:title].freeze

  include Authority::Abilities
  include TrackedCreator
  include SerializedAbilitiesFor
  include Filterable
  include Sluggable
  include HasFormattedAttributes
  include SearchIndexable

  has_formatted_attributes :subtitle

  belongs_to :journal, counter_cache: true
  belongs_to :journal_volume, optional: true, counter_cache: true

  has_one :project, { required: true, inverse_of: :journal_issue }

  validates :journal_id, presence: true
  validates :number, presence: true

  include TrackedCreator

  scope :in_reverse_order, -> { order(number: :desc) }
  scope :in_order, -> { order(number: :asc) }
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

  def slug_candidates
    chunks = (persisted? ? id : SecureRandom.uuid).split("-")
    chunks.map { |chunk| "#{number}-#{chunk}" }
  end

  delegate :avatar, to: :project
  delegate :avatar_color, to: :project
  delegate :avatar_meta, to: :project
  delegate :avatar_styles, to: :project
  delegate :cover_styles, to: :project
  delegate :hero_styles, to: :project
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

  # rubocop:disable Metrics/AbcSize
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
  # rubocop:enable Metrics/AbcSize

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

end
