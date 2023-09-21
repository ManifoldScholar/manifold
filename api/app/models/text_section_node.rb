# frozen_string_literal: true

# @see TextSections::ExtrapolateNodes
class TextSectionNode < ApplicationRecord
  # A list of HTML / MathML tags that should be treated as "intermediate".
  #
  # When figuring out the node to return for an annotation, intermediate nodes
  # are skipped over until they reach a parent that is not intermediate.
  #
  # @see TextSections::CorrectIntermediateNodes
  # @see TextSections::ExtrapolateNodes
  INTERMEDIATE_TAGS = %w[
    mrow
    mi
    msup
    mn
    mo
    thead
    tbody
    tfoot
    tr
    td
    th
  ].freeze

  belongs_to :text_section, inverse_of: :text_section_nodes

  scope :by_type, ->(type) { where(node_type: type) }
  scope :by_uuid, ->(uuid) { where(node_uuid: uuid) }
  scope :terminal, -> { where(intermediate: false) }
  scope :with_intermediate_tag, -> { where(tag: INTERMEDIATE_TAGS) }

  has_many :text_section_node_links, -> { in_order }, inverse_of: :parent, foreign_key: :parent_id
  has_many :ancestor_links, -> { in_reverse_order }, class_name: "TextSectionNodeLink", inverse_of: :child, foreign_key: :child_id

  has_many :parents, -> { terminal }, through: :ancestor_links, source: :parent
  has_many :children, through: :text_section_node_links, source: :child

  def node
    node_extra.with_indifferent_access.merge(
      slice(:node_type, :tag, :node_uuid, :text_digest, :content).compact
    ).merge(
      reconstructed: true,
      attributes: node_attributes
    ).compact
  end

  # @see AnnotationNode#body_json
  # @return [Hash]
  def reconstructed_node
    return node if children_count.zero?

    recon = node.merge(children: [])

    children.each_with_object(recon) do |child, n|
      indices = child.node_indices.drop(depth)

      target = indices.reduce(n) do |hsh, index|
        hsh[:children] ||= []

        hsh[:children][index] ||= {}.with_indifferent_access
      end

      target.merge!(child.node)
    end
  end
end
