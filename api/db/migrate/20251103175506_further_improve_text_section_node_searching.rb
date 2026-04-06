# frozen_string_literal: true

class FurtherImproveTextSectionNodeSearching < ActiveRecord::Migration[7.0]
  def change
    change_table :text_section_nodes do |t|
      t.boolean :current, default: false, null: false
    end
  end
end
