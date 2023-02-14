# frozen_string_literal: true

class CreateTextSectionNodeLinks < ActiveRecord::Migration[6.0]
  def change
    create_view :text_section_node_links
  end
end
