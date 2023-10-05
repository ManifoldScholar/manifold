class AddHiddenInReaderToTextSections < ActiveRecord::Migration[6.1]
  def change
    add_column :text_sections, :hidden_in_reader, :boolean, null: false, default: false
  end
end
