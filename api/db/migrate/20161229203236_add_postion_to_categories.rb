class AddPostionToCategories < ActiveRecord::Migration[5.0]
  def change
    add_column :categories, :position, :integer
  end
end
