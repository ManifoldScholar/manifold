# A section in a text
class TextSection < ApplicationRecord

  attribute :body_json, :indifferent_hash

  # Misc. Concerns
  include Citable
  include SearchIndexable

  # Constants
  KIND_COVER_IMAGE = "cover_image".freeze
  KIND_NAVIGATION = "navigation".freeze
  KIND_SECTION = "section".freeze
  ALLOWED_KINDS = [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION].freeze

  # Authority
  include Authority::Abilities
  include SerializedAbilitiesFor
  self.authorizer_name = "TextSectionAuthorizer"

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
  delegate :social_image, to: :text

  # Validation
  validates :position, numericality: { only_integer: true }
  validates :kind, inclusion: { in: ALLOWED_KINDS }

  # Callbacks
  after_commit :maybe_adopt_or_orphan_annotations!, on: [:update, :destroy]

  # Scopes
  scope :in_texts, lambda { |texts|
    where(text: texts)
  }

  # Search
  searchkick(
    callbacks: :async,
    batch_size: 25,
    merge_mappings: true,
    mappings: {
      properties: {
        text_nodes: {
          type: "nested"
        }
      }
    }
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
      search_result_type: search_result_type,
      title: name,
      parent_text: text&.id,
      parent_project: project&.id,
      parent_keywords: [],
      makers: [],
      text_nodes: properties_for_text_nodes
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

  def title
    name
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

  # rubocop:disable Metrics/AbcSize, Metrics/MethodLength
  def properties_for_text_nodes
    inline = Serializer::HTML::INLINE_ELEMENTS
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

  def adopt_or_orphan_annotations!
    TextSectionJobs::EnqueueAdoptAnnotationsJob.perform_later annotations.pluck(:id)
  end

  private

  def maybe_adopt_or_orphan_annotations!
    return unless body_json_previously_changed? || source_body_previously_changed?

    adopt_or_orphan_annotations!
  end
end
