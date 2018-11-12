class AddCoverDataToTexts < ActiveRecord::Migration[5.0]
  def change
    add_column :texts, :cover_data, :jsonb, default: {}
  end
end
