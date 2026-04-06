class UpdateReadingGroupCounts < ActiveRecord::Migration[6.1]
  def change
    update_view :reading_group_counts, version: 4, revert_to_version: 3
    update_view :reading_group_membership_counts, version: 4, revert_to_version: 3
    update_view :reading_group_user_counts, version: 2, revert_to_version: 1
  end
end
