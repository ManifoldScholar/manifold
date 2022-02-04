# Journals are a grouping of projects
class Journal < ApplicationRecord

  # Constants
  TYPEAHEAD_ATTRIBUTES = [:title, :maker_names].freeze

  # Concerns
  include Authority::Abilities
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
  has_many :journal_volumes, dependent: :destroy
  has_many :journal_issues, dependent: :destroy

  # Validation
  validates :title, presence: true
  validates :draft, inclusion: { in: [true, false] }

  # Attachments
  manifold_has_attached_file :logo, :image
  manifold_has_attached_file :social_image, :image

  scope :by_draft, ->(draft = nil) { where(draft: to_boolean(draft)) unless draft.nil? }
  scope :with_order, ->(by = nil) { by.present? ? order(by) : order(:sort_title, :title) }

  # Search
  scope :search_import, -> {
    includes(
      :collaborators,
      :makers
    )
  }

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
    journal_issues.in_reverse_order.limit(8)
  end

  def recent_journal_issue_ids
    recent_journal_issues.pluck(:id)
  end

end
