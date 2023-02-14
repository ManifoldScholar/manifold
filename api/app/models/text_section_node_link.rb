# frozen_string_literal: true

# A join model between {TextSectionNode}s.
class TextSectionNodeLink < ApplicationRecord
  include View

  belongs_to :parent, class_name: "TextSectionNode", inverse_of: :text_section_node_links
  belongs_to :child, class_name: "TextSectionNode", inverse_of: :ancestor_links

  scope :in_order, -> { order(child_depth: :asc, child_node_index: :asc) }
  scope :in_reverse_order, -> { order(parent_depth: :desc, parent_node_index: :desc) }
end
