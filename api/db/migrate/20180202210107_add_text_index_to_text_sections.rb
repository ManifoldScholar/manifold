class AddTextIndexToTextSections < ActiveRecord::Migration[5.0]
  def change
    add_index :text_sections, :text_id
  end
end
