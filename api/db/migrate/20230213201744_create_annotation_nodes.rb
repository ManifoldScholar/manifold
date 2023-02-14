# frozen_string_literal: true

class CreateAnnotationNodes < ActiveRecord::Migration[6.0]
  def change
    change_table :annotations do |t|
      t.index %i[id text_section_id start_node end_node], name: "index_annotations_node_extrapolation"
    end

    create_view :annotation_nodes
  end
end
