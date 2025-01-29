class AddMarkdownOnlyFlagToReadingGroupCategories < ActiveRecord::Migration[6.1]
  def change
    add_column :reading_group_categories, :markdown_only, :boolean, default: false
  end
end
