class AddStartSectionIdToTexts < ActiveRecord::Migration[5.0]
  def change
    add_column :texts, :start_text_section_id, :uuid
  end
end
