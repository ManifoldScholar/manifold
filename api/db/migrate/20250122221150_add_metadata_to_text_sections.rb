class AddMetadataToTextSections < ActiveRecord::Migration[6.1]
  def change
    add_column :text_sections, :metadata, :jsonb, default: {}
  end
end
