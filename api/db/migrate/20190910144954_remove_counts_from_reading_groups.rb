class RemoveCountsFromReadingGroups < ActiveRecord::Migration[5.2]
  def change
    remove_column :reading_groups, :all_annotations_count, :integer
    remove_column :reading_groups, :annotations_count, :integer
    remove_column :reading_groups, :highlights_count, :integer
  end
end
