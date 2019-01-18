class RemoveTitleFromTexts < ActiveRecord::Migration[5.0]
  def change
    remove_column :texts, :title, :string
  end
end
