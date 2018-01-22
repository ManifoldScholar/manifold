# A section in a text
class TextSection < ApplicationRecord
  attribute :body_json, :indifferent_hash

  # Constants
  KIND_COVER_IMAGE = "cover_image".freeze
  KIND_NAVIGATION = "navigation".freeze
  KIND_SECTION = "section".freeze
  ALLOWED_KINDS = [KIND_COVER_IMAGE, KIND_NAVIGATION, KIND_SECTION].freeze

  # Authority
  include Authority::Abilities
  include Citable

  with_citation do |text_section|
    (text_section.text_citation_parts || {}).merge(
      title: text_section.name,
      container_title: text_section.text_title
    )
  end

  # Search
  searchkick callbacks: :async, batch_size: 100

  # Associations
  belongs_to :text
  belongs_to :ingestion_source
  has_many :annotations
  has_many :searchable_nodes, -> { order(position: :asc) }, dependent: :destroy
  has_many :resources, through: :annotations
  has_many :collections, through: :annotations

  # Delegation
  delegate :citation_parts, to: :text, prefix: true, allow_nil: true
  delegate :source_path, to: :ingestion_source
  delegate :project, to: :text
  delegate :metadata, to: :text, allow_nil: true
  delegate :title, to: :text, prefix: true, allow_nil: true
  delegate :creator_names_array, to: :text, prefix: true, allow_nil: true
  delegate :slug, to: :text, prefix: true

  # Validation
  validates :position, numericality: { only_integer: true }
  validates :kind, inclusion: { in: ALLOWED_KINDS }

  # Scopes
  scope :search_import, -> { includes(text: [:titles, :project]) }

  # Callbacks
  after_commit :update_text_index, if: :body_json_changed?

  def self.update_text_indexes(logger = Rails.logger)
    count = TextSection.count
    iteration = 1
    TextSection.all.find_each do |text_section|
      msg = "Committing searchable text nodes for text section"
      logger.info "#{msg} #{text_section.id}: #{iteration}/#{count}"
      text_section.update_text_index
      iteration += 1
    end
  end

  def search_data
    {
      title: name,
      text_id: text_id
    }
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

  def update_text_index
    searchable_nodes.clear
    SearchableNode.import(properties_for_searchable_nodes)
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

end
