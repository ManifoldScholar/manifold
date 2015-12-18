class AddCategoryIdToTexts < ActiveRecord::Migration
  def change
    add_column :texts, :category_id, :integer
  end
end
