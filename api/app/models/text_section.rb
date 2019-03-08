# A section in a text
class TextSection < ApplicationRecord

  attribute :body_json, :indifferent_hash

  # Misc. Concerns
  include Citable

  # Constants
  KIND_COVER_IMAGE = "cover_image".freeze
  KIND_NAVIGATION = "navigation".freeze
  KIND_SECTION = "section".freeze
  ALLOWED_KINDS = [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION].freeze

  # Authority
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectChildAuthorizer"

  with_citation do |text_section|
    (text_section.text_citation_parts || {}).merge(
      title: text_section.name,
      container_title: text_section.text_title
    )
  end

  # Associations
  belongs_to :text, inverse_of: :text_sections
  has_one :text_started_by, class_name: "Text", foreign_key: "start_text_section_id",
          dependent: :nullify, inverse_of: :start_text_section
  belongs_to :ingestion_source
  # We intentionally do not destroy annotations because we want to handle the orphans.
  has_many :annotations, dependent: :nullify
  has_many :searchable_nodes, -> { order(position: :asc) }, inverse_of: :text_section
  has_many :resources, through: :annotations
  has_many :resource_collections, through: :annotations
  has_many :text_section_stylesheets, dependent: :destroy
  has_many :stylesheets,
           -> { order(position: :asc) },
           through: :text_section_stylesheets,
           dependent: :destroy,
           inverse_of: :text_sections

  # Delegation
  delegate :citation_parts, to: :text, prefix: true, allow_nil: true
  delegate :source_path, to: :ingestion_source
  delegate :project, to: :text, allow_nil: true
  delegate :metadata, to: :text, allow_nil: true
  delegate :title, to: :text, prefix: true, allow_nil: true
  delegate :creator_names_array, to: :text, prefix: true, allow_nil: true
  delegate :slug, to: :text, prefix: true

  # Validation
  validates :position, numericality: { only_integer: true }
  validates :kind, inclusion: { in: ALLOWED_KINDS }

  # Callbacks
  after_commit :enqueue_searchable_nodes_generation!, if: :should_generate_searchable_nodes?
  after_commit :adopt_or_orphan_annotations!
  before_destroy :destroy_searchable_nodes!

  # Scopes
  scope :in_texts, lambda { |texts|
    where(text: texts)
  }

  # Search
  searchkick(
    callbacks: :async,
    batch_size: 500
  )

  scope :search_import, lambda {
    includes(
      text: [:project, :makers]
    )
  }

  def should_index?
    text.present? && text.should_index?
  end

  def search_data
    {
      title: name,
      text_id: text.id,
      project_id: text.project_id,
      text_title: text.title,
      creator_names: text&.makers&.map(&:full_name)
    }.merge(search_hidden)
  end

  def search_hidden
    text.present? ? text.search_hidden : { hidden: true }
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

  def enqueue_searchable_nodes_generation!
    TextSectionJobs::GenerateSearchableNodesJob.perform_later id
  end

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def properties_for_searchable_nodes
    inline = Serializer::Html::INLINE_ELEMENTS
    *, nodes = text_nodes.reverse.inject([false, []]) do |(once_more, nodes), node|
      next [once_more, nodes] if node["content"].strip.blank?

      if (inline.include?(node["parent"]) && nodes[-1]) || once_more
        # Append inline content to previous node
        nodes[-1][:content] = nodes[-1][:content].insert(0, node["content"] + " ")
        # Collect wrapped up uuids
        nodes[-1][:contains] << node[:node_uuid]
        nodes[-1][:node_uuid] = node[:node_uuid]
        # Inline nodes break up block nodes. When we collapse the inline node, we also
        # need to collapse the next node, since it's the later half of the broken block
        # node. The once_more variable stores this fact.
        next [!once_more, nodes]
      end
      nodes.push(
        content: node["content"],
        contains: [node["node_uuid"]],
        node_uuid: node["node_uuid"],
        text_section_id: id
      )
      next [false, nodes]
    end
    nodes.reverse.map.with_index(1) { |node, index| node.merge(position: index) }
  end
  # rubocop:enable Metrics/AbcSize, Metrics/MethodLength

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

  class << self
    def generate_searchable_nodes!(logger = Rails.logger)
      count = TextSection.count
      iteration = 1
      TextSection.find_each do |text_section|
        msg = "Committing searchable text nodes for text section"
        logger.info "#{msg} #{text_section.id}: #{iteration}/#{count}"
        text_section.enqueue_searchable_nodes_generation!
        iteration += 1
      end
    end
  end

  private

  # Checking if ID changed allows us to use this in an after_commit callback
  # while still returning true on initial create.
  def should_generate_searchable_nodes?
    id_previously_changed? || body_json_previously_changed?
  end

  def destroy_searchable_nodes!
    ids = searchable_nodes.pluck :id
    TextSectionJobs::DestroySearchableNodesJob.perform_later ids
  end

  def adopt_or_orphan_annotations!
    return unless body_json_previously_changed?

    TextSectionJobs::EnqueueAdoptAnnotationsJob.perform_later annotations.pluck(:id)
  end
end
