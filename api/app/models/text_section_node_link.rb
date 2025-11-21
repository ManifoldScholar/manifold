# frozen_string_literal: true

# A join model between {TextSectionNode}s.
class TextSectionNodeLink < ApplicationRecord
  include View

  belongs_to_readonly :parent, class_name: "TextSectionNode", inverse_of: :text_section_node_links, primary_key: %i[text_section_id id], foreign_key: %i[text_section_id parent_id]
  belongs_to_readonly :child, class_name: "TextSectionNode", inverse_of: :ancestor_links, primary_key: %i[text_section_id id], foreign_key: %i[text_section_id child_id]

  scope :in_order, -> { order(child_depth: :asc, child_node_index: :asc) }
  scope :in_reverse_order, -> { order(parent_depth: :desc, parent_node_index: :desc) }
end
