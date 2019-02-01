require "memoist"

# A single Text
class Text < ApplicationRecord

  TYPEAHEAD_ATTRIBUTES = [:title, :makers].freeze

  # Authorization
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include Concerns::ValidatesSlugPresence

  # Default Scope
  default_scope { order(position: :asc).includes(:titles, :text_subjects, :category) }

  # Concerns
  extend Memoist
  include Collaborative
  include Citable
  include TrackedCreator
  include Metadata
  extend FriendlyId
  include Attachments

  # Magic
  with_metadata %w(
    series_title container_title isbn issn doi unique_identifier language
    original_publisher original_publisher_place original_title publisher publisher_place
    version series_number edition issue volume rights rights_territory restrictions
    rights_holder
  )

  with_citation do |text|
    text_authors = text.creator_names_array
    author = text_authors.empty? ? text.project_creator_names_array : text_authors
    issued = text.publication_date || text.project_publication_date
    {
      title: text.title,
      author: author,
      issued: issued
    }
  end
  with_citable_children :text_sections

  # URLs
  friendly_id :title, use: :slugged

  # Fields
  serialize :structure_titles, Hash
  serialize :toc, Array
  serialize :page_list, Array
  serialize :landmarks, Array

  # Acts as List
  acts_as_list scope: [:project_id, :category_id]

  # Associations
  belongs_to :project, optional: true, touch: true
  belongs_to :category, optional: true
  belongs_to :start_text_section, optional: true, class_name: "TextSection",
             inverse_of: :text_started_by
  has_many :ingestions, dependent: :nullify, inverse_of: :text
  has_many :titles, class_name: "TextTitle", dependent: :destroy, inverse_of: :text
  has_many :text_subjects, dependent: :destroy
  has_many :subjects, through: :text_subjects
  has_many :ingestion_sources, dependent: :destroy
  has_many :text_sections, -> { order(position: :asc) }, dependent: :destroy,
           inverse_of: :text
  has_many :stylesheets, -> { order(position: :asc) }, dependent: :destroy,
           inverse_of: :text
  has_many :favorites, as: :favoritable, dependent: :destroy, inverse_of: :favoritable
  has_many :annotations, through: :text_sections
  has_one :text_created_event, -> { where event_type: EventType[:text_added] },
          class_name: Event, as: :subject, dependent: :destroy, inverse_of: :subject
  has_one :toc_section,
          -> { where(kind: TextSection::KIND_NAVIGATION) },
          class_name: "TextSection",
          inverse_of: :text

  # Delegations
  delegate :creator_names_array, to: :project, prefix: true, allow_nil: true
  delegate :publication_date, to: :project, prefix: true, allow_nil: true
  delegate :title, to: :category, prefix: true
  delegate :title_formatted, to: :title_main, allow_nil: true
  delegate :title_plaintext, to: :title_main, allow_nil: true
  delegate :subtitle_formatted, to: :title_subtitle, allow_nil: true
  delegate :subtitle_plaintext, to: :title_subtitle, allow_nil: true

  # Validation
  validates :spine,
            presence: true, unless: proc { |x| x.spine.is_a?(Array) && x.spine.empty? }

  # Scopes
  scope :published, ->(published) { where(published: published) if published.present? }

  # Attachments
  manifold_has_attached_file :cover, :image, no_styles: true

  # Callbacks
  after_commit :trigger_text_added_event, on: [:create, :update]

  # Search
  searchkick(word_start: TYPEAHEAD_ATTRIBUTES,
             callbacks: :async,
             batch_size: 500,
             highlight: [:title, :body])

  scope :search_import, lambda {
    includes(
      :makers,
      :project,
      :category,
      :titles
    )
  }

  # During ingestion, texts can be created before they're added to a project.
  # We don't want to index those orphaned texts.
  def should_index?
    project.present?
  end

  def search_data
    {
      title: title,
      body: description,
      project_id: project.id,
      title_values: titles.map(&:value),
      project_title: project.title,
      makers: makers.map(&:name)
    }.merge(search_hidden)
  end

  def search_hidden
    project.present? ? project.search_hidden : { hidden: true }
  end

  def title_main
    title_by_kind TextTitle::KIND_MAIN
  end

  def title_subtitle
    title_by_kind TextTitle::KIND_SUBTITLE
  end

  def title_by_kind(kind)
    if association(:titles).loaded?
      titles.detect { |t| t.kind == kind }
    else
      titles.find_by(kind: kind)
    end
  end

  def set_title_value(kind, value)
    title = titles.find_or_initialize_by(kind: kind)
    title.value = value
    title.save
  end

  def get_title_value(title, default = nil)
    return default unless title.present?
    title.value
  end

  def title=(value)
    set_title_value TextTitle::KIND_MAIN, value
  end

  def subtitle=(value)
    set_title_value TextTitle::KIND_SUBTITLE, value
  end

  def title
    get_title_value title_main, "untitled"
  end

  def subtitle
    get_title_value title_subtitle
  end

  def section_before(position)
    # text_sections.where("position > ?", position)
  end

  def section_after(position); end

  def section_at(position)
    text_sections.find_by(position: position)
  end

  def find_text_section_by_source_path(path)
    source = ingestion_sources.find_by(source_path: path)
    return unless source
    source_id = source.source_identifier
    text_sections.find_by(source_identifier: source_id)
  end

  def section_source_map
    map = {}
    text_sections.each do |ts|
      next if ts.ingestion_source.nil?
      path = ts.ingestion_source.source_path
      map[path] = ts
    end
    map
  end
  memoize :section_source_map

  def source_path_map
    map = {}
    ingestion_sources.each do |s|
      map[s.source_path] = s.proxy_path
    end
    map
  end
  memoize :source_path_map

  def to_s
    title
  end

  private

  def category_list_scope
    category_id || 0
  end

  def trigger_text_added_event
    Event.trigger(EventType[:text_added], self) if project
  end

  def annotations_count
    annotations.only_annotations.count
  end

  def highlights_count
    annotations.only_highlights.count
  end
end
