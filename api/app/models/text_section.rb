# frozen_string_literal: true

# A section in a {Text}.
class TextSection < ApplicationRecord
  include Authority::Abilities
  include Attachments
  include Citable
  include Collectable
  include Filterable
  include FriendlyId
  include Metadata
  include HasKeywordSearch
  include SearchIndexable
  include SerializedAbilitiesFor
  include SoftDeletionSupport

  KIND_COVER_IMAGE = "cover_image"
  KIND_NAVIGATION = "navigation"
  KIND_SECTION = "section"
  ALLOWED_KINDS = [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION].freeze

  self.authorizer_name = "TextSectionAuthorizer"

  with_citation do |text_section|
    (text_section.text_citation_parts || {}).merge(
      title: text_section.name,
      container_title: text_section.text_title
    )
  end

  with_metadata %w(
    citation_override
  )

  acts_as_list scope: :text

  belongs_to :text, inverse_of: :text_sections

  has_one :project, through: :text
  has_one :text_started_by, class_name: "Text", foreign_key: "start_text_section_id",
          dependent: :nullify, inverse_of: :start_text_section

  belongs_to :ingestion_source, optional: true

  has_one :journal, through: :project

  # We intentionally do not destroy annotations because we want to handle the orphans.
  has_many :annotations, dependent: :nullify
  has_many :resources, through: :annotations
  has_many :resource_collections, through: :annotations
  has_many :text_section_nodes, inverse_of: :text_section, dependent: :delete_all
  has_many :text_section_stylesheets, dependent: :destroy
  has_many :stylesheets,
           -> { order(position: :asc) },
           through: :text_section_stylesheets,
           dependent: :destroy,
           inverse_of: :text_sections
  has_many :ingestions, dependent: :nullify, inverse_of: :text_section

  attribute :body_json, :indifferent_hash

  delegate :citation_parts, to: :text, prefix: true, allow_nil: true
  delegate :source_path, to: :ingestion_source, allow_nil: true
  delegate :project, to: :text, allow_nil: true
  delegate :metadata, to: :text, prefix: true, allow_nil: true
  delegate :title, to: :text, prefix: true, allow_nil: true
  delegate :creator_names_array, to: :text, prefix: true, allow_nil: true
  delegate :slug, to: :text, prefix: true
  delegate :social_image_data, to: :text, allow_nil: true
  delegate :social_description, to: :text, allow_nil: true

  manifold_has_attached_file :social_image, :image

  validates :position, numericality: { only_integer: true }
  validates :kind, inclusion: { in: ALLOWED_KINDS }
  validates :name, presence: { on: :from_api }
  validates :slug, presence: true, allow_nil: true

  before_validation :update_body_json
  after_destroy :remove_linked_toc_entries, unless: :skip_removal_of_toc_entries?
  after_save_commit :asynchronously_index_nodes!
  after_commit :maybe_adopt_or_orphan_annotations!, on: [:update, :destroy]

  scope :in_texts, ->(texts) { where(text: texts) }
  scope :ordered, -> { order(position: :asc) }

  scope :with_unindexed_nodes, -> { where(id: TextSectionNode.sans_search_indexed.select(:text_section_id).distinct) }

  multisearches! :body_text

  alias_attribute :title, :name

  friendly_id :slug_candidates, use: :scoped, scope: :text

  def has_duplicate_source_identifier?
    # :nocov:
    return false if text.blank? || new_record?
    # :nocov:

    text.text_sections.where.not(id: id).exists?(source_identifier: source_identifier)
  end

  def has_unique_source_identifier?
    # :nocov:
    return false if text.blank? || new_record?
    # :nocov:

    !has_duplicate_source_identifier?
  end

  # @!attribute [r] packaging_base_path
  # @return [String]
  def packaging_base_path
    "text/#{packaging_identifier}".gsub(/\A(.+)(?<!\.xhtml)\z/, '\1.xhtml')
  end

  # @!attribute [r] packaging_identifier
  # @return [String]
  def packaging_identifier
    has_unique_source_identifier? ? source_identifier : slug
  end

  def skip_removal_of_toc_entries?
    destroyed_by_association || soft_deleting?
  end

  def slug_candidates
    reserved_words = %w(all new edit session login logout users admin
                        stylesheets assets javascripts)

    return :id if name.blank?
    return [[:name, :position]] if reserved_words.include?(name.downcase)

    name
  end

  def multisearchable_makers
    []
  end

  def multisearchable_parent_keywords
    []
  end

  def should_index?
    project.present? && !project.draft? && super
  end

  def previous_section
    text.section_before(position)
  end

  def next_section
    text.section_after(position)
  end

  def toc?
    kind == KIND_NAVIGATION
  end

  def cover?
    kind == KIND_COVER_IMAGE
  end

  def to_s
    name
  end

  def to_section_map
    slice(:id, :name).merge(hidden: hidden_in_reader)
  end

  def text_nodes(node = body_json, nodes = [], parent = nil)
    if node["node_type"] == "text"
      type = parent && parent["node_type"] == "element" ? parent["tag"] : nil
      nodes.push node.merge(parent: type)
    elsif node["children"]
      node["children"].each { |child_node| text_nodes(child_node, nodes, node) }
    end
    nodes
  end

  def text_node_for(node_uuid)
    text_nodes.detect { |tn| tn[:node_uuid] == node_uuid }
  end

  def text_node_range(start_uuid, end_uuid)
    start_node = text_node_for(start_uuid)
    end_node = text_node_for(end_uuid)
    return [] unless start_node.present? && end_node.present?

    text_nodes[text_nodes.index(start_node)..text_nodes.index(end_node)]
  end

  def adopt_or_orphan_annotations!
    TextSectionJobs::EnqueueAdoptAnnotationsJob.perform_later annotations.pluck(:id)
  end

  # @api private
  # @return [void]
  def asynchronously_index_current_node_content!
    TextSections::IndexCurrentNodeContentJob.perform_later self
  end

  # @api private
  # @return [void]
  def asynchronously_index_nodes!
    TextSections::IndexNodesJob.perform_later self
  end

  # @api private
  # @return [void]
  def extrapolate_nodes!
    ManifoldApi::Container["text_sections.extrapolate_nodes"].(text_section: self).value!
  end

  # @return [String]
  def extracted_body_content
    data = []

    extract_content_from!(body_json, data: data)

    data.join(" ")
  end

  # @return [void]
  def index_contained_content!(**options)
    ManifoldApi::Container["text_sections.index_contained_content"].(self, **options).value!
  end

  # @return [void]
  def index_nodes!
    ManifoldApi::Container["text_sections.index_nodes"].(self).value!
  end

  # @return [void]
  def maintain_current_nodes!
    ManifoldApi::Container["text_sections.maintain_current_nodes"].(self).value!
  end

  private

  def extract_content_from!(source, data: [])
    case source
    when Array
      source.each { |item| extract_content_from!(item, data: data) }
    when Hash
      extract_content_from!(source["content"], data: data)
      extract_content_from!(source["children"], data: data)
    when /\S+/
      data << source.to_s.squish
    end
  end

  def maybe_adopt_or_orphan_annotations!
    return unless body_json_previously_changed? || source_body_previously_changed?

    adopt_or_orphan_annotations!
  end

  def update_body_json
    return unless body_changed?

    self.body_json = Serializer::HTML.serialize_as_json(body)
    self.body_text = extracted_body_content
  end

  def remove_linked_toc_entries
    text&.remove_toc_entry!(id)
  end

  class << self
    # @return [void]
    def extrapolate_all_nodes!
      find_each do |text_section|
        TextSections::ExtrapolateNodesJob.perform_later text_section
      end
    end

    # @api private
    # @note Part of PG Search
    def rebuild_pg_search_documents
      connection.exec_update(<<~SQL)
      INSERT INTO pg_search_documents
      (
        searchable_type, searchable_id,
        journal_id, project_id, text_id, text_section_id,
        search_result_type,
        title, content,
        created_at, updated_at
      )
      SELECT
        'TextSection' AS searchable_type,
        ts.id AS searchable_id,
        ji.journal_id AS journal_id,
        p.id AS project_id,
        t.id AS text_id,
        ts.id AS text_section_id,
        'text_section' AS search_result_type,
        ts.name AS title,
        ts.body_text AS content,
        ts.created_at, ts.updated_at
      FROM text_sections ts
      INNER JOIN texts t ON t.id = ts.text_id
      INNER JOIN projects p ON p.id = t.project_id
      LEFT OUTER JOIN journal_issues ji ON ji.id = p.journal_issue_id
      WHERE NOT p.draft
      ON CONFLICT (searchable_type, searchable_id) DO UPDATE SET
        journal_id = EXCLUDED.journal_id,
        project_id = EXCLUDED.project_id,
        text_id = EXCLUDED.text_id,
        text_section_id = EXCLUDED.text_section_id,
        search_result_type = EXCLUDED.search_result_type,
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        updated_at = EXCLUDED.updated_at
      SQL
    end
  end
end
