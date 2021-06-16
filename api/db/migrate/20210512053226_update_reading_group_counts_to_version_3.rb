class UpdateReadingGroupCountsToVersion3 < ActiveRecord::Migration[6.0]
  def change
    remove_column :reading_groups, :memberships_count, :integer, null: false, default: 0

    update_view :reading_group_counts, version: 3, revert_to_version: 2
  end
end
