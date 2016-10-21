class AddCategoryIdToTexts < ActiveRecord::Migration
  def change
    add_column :texts, :category_id, :uuid
  end
end
