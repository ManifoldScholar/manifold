class AddCategoryIdToTexts < ActiveRecord::Migration[5.0]
  def change
    add_column :texts, :category_id, :uuid
  end
end
