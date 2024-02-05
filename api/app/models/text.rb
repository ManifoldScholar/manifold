# A single Text
class Text < ApplicationRecord

  TYPEAHEAD_ATTRIBUTES = [:title, :makers].freeze

  # Concerns
  include Authority::Abilities
  include Collectable
  include SerializedAbilitiesFor
  include Sluggable
  include StoresFingerprints
  extend Memoist
  include Collaborative
  include Citable
  include Filterable
  include TrackedCreator
  include Metadata
  include Attachments
  include SearchIndexable
  include TableOfContentsWithCollected

  # PaperTrail
  has_paper_trail meta: {
    parent_item_id: :project_id,
    parent_item_type: "Project",
    title_fallback: :title_plaintext
  }

  # Default Scope
  default_scope { order(position: :asc).preload(:titles, :text_subjects, :category) }

  # Magic
  has_formatted_attributes :description
  with_metadata %w(
    series_title container_title isbn issn doi unique_identifier language
    original_publisher original_publisher_place original_title publisher publisher_place
    version series_number edition issue volume rights rights_territory restrictions
    rights_holder original_publication_date
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

  attribute :structure_titles, :indifferent_hash, default: {}
  attribute :toc, Texts::TableOfContentsEntry.to_array_type, default: []
  attribute :landmarks, Texts::LandmarkEntry.to_array_type, default: []

  jsonb_accessor(
    :export_configuration,
    exports_as_epub_v3: [:boolean, { default: false, store_key: :epub_v3 }]
  )

  # Acts as List
  acts_as_list scope: [:project_id, :category_id]

  # Associations
  belongs_to :project, optional: true, touch: true
  belongs_to :category, optional: true
  belongs_to :start_text_section, optional: true, class_name: "TextSection",
             inverse_of: :text_started_by
  has_many :ingestions, dependent: :nullify, inverse_of: :text
  has_many :titles, class_name: "TextTitle", autosave: true, dependent: :destroy, inverse_of: :text
  has_many :text_subjects, dependent: :destroy
  has_many :subjects, through: :text_subjects
  has_many :ingestion_sources, dependent: :destroy
  has_many :text_sections, -> { order(position: :asc) }, dependent: :destroy,
           inverse_of: :text, autosave: true
  has_one :text_section_aggregation, inverse_of: :text
  has_many :stylesheets, -> { order(position: :asc) }, dependent: :destroy,
           inverse_of: :text
  has_many :favorites, as: :favoritable, dependent: :destroy, inverse_of: :favoritable
  has_many :annotations, through: :text_sections
  has_one :text_created_event, -> { where event_type: EventType[:text_added] },
          class_name: "Event", as: :subject, dependent: :destroy, inverse_of: :subject
  has_one :toc_section,
          -> { where(kind: TextSection::KIND_NAVIGATION) },
          class_name: "TextSection",
          inverse_of: :text
  has_one :last_finished_ingestion, -> { where(state: "finished").order(created_at: :desc) }, class_name: "Ingestion"
  has_many :cached_external_source_links, inverse_of: :text, dependent: :destroy
  has_many :cached_external_sources, through: :cached_external_source_links
  has_many :text_exports, inverse_of: :text, dependent: :destroy
  has_many :text_export_statuses, inverse_of: :text
  has_one :current_text_export_status, -> { current }, class_name: "TextExportStatus"
  has_one :current_text_export, through: :current_text_export_status, source: :text_export
  has_many :action_callouts,
           dependent: :destroy,
           inverse_of: :text

  # Delegations
  delegate :creator_names_array, to: :project, prefix: true, allow_nil: true
  delegate :publication_date, to: :project, prefix: true, allow_nil: true
  delegate :title, to: :category, prefix: true
  delegate :title_formatted, to: :title_main, allow_nil: true
  delegate :title_plaintext, to: :title_main, allow_nil: true
  delegate :subtitle_formatted, to: :title_subtitle, allow_nil: true
  delegate :subtitle_plaintext, to: :title_subtitle, allow_nil: true
  delegate :social_image, to: :project
  delegate :auto_generated_toc, to: :text_section_aggregation, allow_nil: true
  delegate :texts_nav, to: :project, prefix: true, allow_nil: true
  delegate :journal_nav, to: :project, prefix: true, allow_nil: true

  before_validation :ensure_toc_uids!

  after_initialize :migrate_toc!

  # Validation
  validate :validate_start_text_section
  validate :validate_toc
  validate :ensure_main_title_present!, on: :from_api

  # Scopes
  scope :published, ->(published) { where(published: published) if published.present? }
  scope :by_category, ->(category) { where(category: category) if category.present? }
  scope :uncategorized, -> { where(category: nil) }
  scope :categorized, -> { where.not(category: nil) }
  scope :exports_as_epub_v3, -> { export_configuration_where(exports_as_epub_v3: true) }
  scope :sans_current_epub_v3_export, -> { where.not(id: TextExportStatus.current_text_ids) }
  scope :with_current_epub_v3_export, -> { where(id: TextExportStatus.current_text_ids) }
  scope :pending_epub_v3_export, -> { exports_as_epub_v3.sans_current_epub_v3_export }

  # Attachments
  manifold_has_attached_file :cover, :image

  # Callbacks
  after_commit :trigger_text_added_event, on: [:create, :update]
  after_commit :inject_global_stylesheet, on: :create

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

  def age
    (Time.zone.today - created_at.to_date).to_i
  end

  def search_data
    {
      search_result_type: search_result_type,
      title: title,
      full_text: description,
      parent_project: project&.id,
      keywords: titles.map(&:value),
      parent_keywords: [project&.title],
      makers: makers.map(&:full_name),
      metadata: metadata.values
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
    titles.detect { |t| t.kind == kind }
  end

  def set_title_value(kind, value)
    if value.blank?
      if kind == TextTitle::KIND_SUBTITLE
        titles.each do |title|
          title.mark_for_destruction if title.kind == kind
        end
      end

      return
    end

    title = titles.detect { |t| t.kind == kind } || titles.build(kind: kind)
    title.value = value
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

  def ensure_main_title_present!
    errors.add :title, :blank if title_main.blank?
  end

  def section_before(position)
    # text_sections.where("position > ?", position)
  end

  def section_after(position); end

  def section_at(position)
    text_sections.find_by(position: position)
  end

  def section_by_id(section_id)
    if text_sections.loaded?
      text_sections.detect do |section|
        section.id == section_id
      end
    else
      text_sections.where(id: section_id).first
    end
  end

  def section_names=(section_names)
    return unless new_record?

    Array(section_names).each_with_index do |name, i|
      position = i + 1

      text_sections.build(name: name, kind: "section", position: position)
    end
  end

  def calculated_start_text_section_id
    start_text_section_id || text_sections.ordered.first.try(:id)
  end

  def spine
    text_sections.ordered.pluck(:id)
  end

  def find_text_section_by_source_path(path)
    source = ingestion_sources.find_by(source_path: path)
    return unless source

    source_id = source.source_identifier
    text_sections.find_by(source_identifier: source_id)
  end

  memoize def section_source_map
    text_sections.each_with_object({}) do |ts, map|
      next if ts.ingestion_source.nil?

      path = ts.ingestion_source.source_path

      map[path] = ts
    end
  end

  memoize def source_path_map
    ingestion_sources.each_with_object({}) do |s, map|
      map[s.source_path] = s.proxy_path
    end
  end

  # @param [String, TextSection] source_path
  # @return [Hash, nil]
  def landmark_for(source_path)
    return toc_entry_for(source_path.source_path) if source_path.is_a?(TextSection)

    landmarks.detect do |landmark|
      landmark.source_path == source_path
    end
  end

  memoize def toc_landmark
    landmarks.detect(&:toc?)
  end

  memoize def toc_section
    landmark = toc_landmark

    return nil if landmark.blank?

    toc_entry = toc_entry_detect do |entry|
      entry.anchor == landmark.anchor
    end

    return nil if toc_entry.blank?

    section_by_id toc_entry.id
  end

  delegate :id, to: :toc_section, prefix: true, allow_nil: true

  # @api private
  # @param [<Hash>] list
  # @param [Integer] depth
  # @yield [toc_entry]
  # @yieldparam [Hash] toc_entry
  # @yieldreturn [Boolean]
  # @return [Hash, nil]
  def toc_entry_detect(list: toc, depth: 0, &block)
    return enum_for(__method__) unless block_given?

    catch(:found) do
      Array(list).each do |toc_entry|
        throw :found, toc_entry if yield(toc_entry)

        children = toc_entry["children"]

        found = toc_entry_detect(list: children, depth: depth + 1, &block) if children.present?

        throw :found, found unless found.nil?
      end

      nil
    end
  end

  # @param [String, TextSection] text_section_id
  # @return [Hash, nil]
  def toc_entry_for(text_section_id)
    return toc_entry_for(text_section_id.id) if text_section_id.is_a?(TextSection)

    toc_entry_detect do |entry|
      entry.id == text_section_id
    end
  end

  def toc_entry_by_uid(uid)
    toc_entry_detect do |entry|
      entry.uid == uid
    end
  end

  # @api private
  # @return [void]
  def ensure_toc_uids!
    return unless respond_to?(:toc)

    toc.each(&:ensure_uid!)
  end

  # @api private
  # @return [void]
  def migrate_toc!
    # When Sidekiq indexes, it doesn't necessarily query for all model attributes. In that
    # case, we don't want this method to run.
    return unless respond_to?(:toc)
    return unless persisted?

    ensure_toc_uids!

    update_column :toc, toc if toc_changed?
  end

  def remove_nested_toc_entries(deleted_section_id, entries = toc)
    entries.each_with_object([]) do |entry, new_entries|
      next if entry[:id] == deleted_section_id

      entry[:children] = remove_nested_toc_entries(deleted_section_id, entry[:children]) if entry[:children].present?

      new_entries << entry
    end
  end

  def remove_toc_entry!(deleted_section_id)
    return if toc.empty?

    new_toc = remove_nested_toc_entries(deleted_section_id)

    update_attribute :toc, new_toc
  end

  def to_s
    title
  end

  def annotations_count
    annotations.only_annotations.count
  end

  def highlights_count
    annotations.only_highlights.count
  end

  # @!attribute [r] epub_v3_export_url
  # @return [String]
  def epub_v3_export_url
    current_text_export&.asset&.url if exports_as_epub_v3?
  end

  def has_epub_v3_export_url?
    exports_as_epub_v3? && current_text_export&.asset.present?
  end

  # @return [void]
  def toggle_exports_as_epub_v3!
    update_attribute :exports_as_epub_v3, !exports_as_epub_v3
  end

  def titles_packaging_metadata
    titles.map { |t| t.packaging_metadata }
  end

  # @return [{ Symbol => Object }]
  def packaging_metadata
    metadata.with_indifferent_access
      .merge(slice(:id, :slug, :publication_date, :created_at, :updated_at))
      .merge(titles: titles_packaging_metadata.compact)
      .merge(collaborators: collaborator_packaging_metadata)
  end

  private

  def category_list_scope
    category_id || 0
  end

  def trigger_text_added_event
    Event.trigger(EventType[:text_added], self) if project
  end

  def validate_start_text_section
    return unless start_text_section
    return if text_sections.include? start_text_section

    errors.add(:start_text_section, "does not belong to this text")
  end

  def validate_toc
    return if toc.empty?

    toc.each do |toc_entry|
      has_section = toc_entry[:source_path] || text_sections.find_by(id: toc_entry[:id])
      has_name = toc_entry[:label].present?

      errors.add(:toc, "entry must be linked to a text section") unless has_section
      errors.add(:name, "cannot be blank") unless has_name
    end
  end

  def global_styles
    Settings.instance.ingestion[:global_styles]
  end

  def global_stylesheet
    stylesheets.find_by(
      source_identifier: "global-styles",
      name: "Global Styles"
    )
  end

  def global_stylesheet_attributes
    {}.tap do |attrs|
      attrs[:name] = "Global Styles"
      attrs[:source_identifier] = "global-styles"
      attrs[:position] = stylesheets.count + 1
      attrs[:ingested] = false
      attrs[:creator] = User.find(creator_id)
      attrs[:raw_styles] = global_styles
      attrs[:hashed_content] = Digest::MD5.hexdigest(global_styles)
      attrs[:source_identifier] = "global-styles"
      attrs[:applies_to_all_text_sections] = true
      attrs[:skip_formatting] = true
    end
  end

  def inject_global_stylesheet
    return if global_stylesheet.present?
    return unless global_styles.present?

    stylesheets.create global_stylesheet_attributes
  end

end
