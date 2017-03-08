class AddPositionToTexts < ActiveRecord::Migration[5.0]
  def change
    add_column :texts, :position, :integer
  end
end
