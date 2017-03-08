class AddSpineToTexts < ActiveRecord::Migration[5.0]
  def change
    add_column :texts, :spine, :string, array: true
  end
end
