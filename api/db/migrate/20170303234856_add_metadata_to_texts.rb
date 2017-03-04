class AddMetadataToTexts < ActiveRecord::Migration[5.0]
  def change
    add_column :texts, :metadata, :jsonb, default: {}
  end
end
