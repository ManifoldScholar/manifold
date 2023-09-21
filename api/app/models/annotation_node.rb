# frozen_string_literal: true

# A view that calculates the smallest node possible to satisfy a given {Annotation}.
#
# Relies heavily on {TextSectionNode}.
class AnnotationNode < ApplicationRecord
  include View

  self.primary_key = :annotation_id

  belongs_to :annotation, inverse_of: :annotation_node

  belongs_to :start_node, class_name: "TextSectionNode"
  belongs_to :end_node, class_name: "TextSectionNode"
  belongs_to :ancestor_node, -> { preload(:children) }, class_name: "TextSectionNode"

  attribute :existing_node, :indifferent_hash

  delegate :reconstructed_node, to: :ancestor_node, allow_nil: true

  # @!attribute [r] node
  # If we don't find a matching / current node on the {TextSection}
  # (i.e. `ancestor_node.body_hash != text_section.body_hash`),
  # we will instead {TextSectionNode#reconstructed_node reconstruct the node}.
  #
  # For entirely orphaned / legacy annotations, this can still be nil, because
  # it won't find `ancestor_node`.
  #
  # @note Exposed on {Annotation} as `derived_node`.
  # @return [Hash, nil]
  def node
    existing_node.presence || reconstructed_node
  end
end
