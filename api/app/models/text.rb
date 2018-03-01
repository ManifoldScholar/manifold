require "memoist"

# A single Text
class Text < ApplicationRecord

  # Authorization
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  # Default Scope
  default_scope { order(position: :asc).includes(:titles, :text_subjects, :category) }

  # Concerns
  extend Memoist
  include Collaborative
  include Citable
  include TrackedCreator
  include Metadata
  extend FriendlyId

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
  has_one :publishing_project, class_name: "Project", foreign_key: "published_text_id"
  belongs_to :start_text_section, optional: true, class_name: "TextSection"
  has_many :titles, class_name: "TextTitle", dependent: :destroy
  has_many :text_subjects
  has_many :subjects, through: :text_subjects
  has_many :ingestion_sources, dependent: :destroy
  has_many :text_sections,
           -> { order(position: :asc) },
           dependent: :destroy,
           inverse_of: :text
  has_many :stylesheets, -> { order(position: :asc) }, dependent: :destroy
  has_many :favorites, as: :favoritable, dependent: :destroy
  has_many :annotations, through: :text_sections
  has_one :text_created_event, -> { where event_type: Event::TEXT_ADDED },
          class_name: Event,
          as: :subject,
          dependent: :destroy

  # Delegations
  delegate :creator_names_array, to: :project, prefix: true, allow_nil: true
  delegate :publication_date, to: :project, prefix: true, allow_nil: true

  # Validation
  validates :spine,
            presence: true, unless: proc { |x| x.spine.is_a?(Array) && x.spine.empty? }

  # Callbacks
  after_commit :trigger_text_added_event, on: [:create, :update]

  def title
    main_title = if association(:titles).loaded?
                   titles.detect { |t| t.kind == TextTitle::KIND_MAIN }
                 else
                   titles.find_by(kind: TextTitle::KIND_MAIN)
                 end
    return "untitled" unless main_title
    main_title.value
  end

  def title=(value)
    title = titles.find_or_initialize_by(kind: TextTitle::KIND_MAIN)
    title.value = value
    title.save
  end

  def section_before(position)
    # text_sections.where("position > ?", position)
  end

  def section_after(position); end

  def section_at(position)
    text_sections.find_by(position: position)
  end

  def find_ingestion_source_by_identifier(identifier)
    ingestion_sources.to_ary.find { |is| is.source_identifier == identifier }
  end

  def find_text_section_by_source_path(path)
    source = ingestion_sources.find_by(source_path: path)
    return unless source
    source_id = source.source_identifier
    text_sections.to_ary.find { |cd| cd.source_identifier == source_id }
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
      map[s.source_path] = s.attachment.url
    end
    map
  end
  memoize :source_path_map

  def cover
    ingestion_sources.find_by(kind: IngestionSource::KIND_COVER_IMAGE)
  end

  def cover_styles
    cover_source = ingestion_sources.find_by(kind: IngestionSource::KIND_COVER_IMAGE)
    return nil unless cover_source
    cover_source.try(:attachment_styles)
  end

  def toc_section
    text_sections.find_by(kind: TextSection::KIND_NAVIGATION)
  end

  def published?
    project && project.published_text == self
  end

  def to_s
    title
  end

  private

  def category_list_scope
    category_id || 0
  end

  def trigger_text_added_event
    Event.trigger(Event::TEXT_ADDED, self) if project
  end

  def annotations_count
    annotations.only_annotations.count
  end

  def highlights_count
    annotations.only_highlights.count
  end
end
