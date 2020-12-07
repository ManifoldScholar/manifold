class UpdateReadingGroupCountsToVersion2 < ActiveRecord::Migration[6.0]
  def change
    update_view :reading_group_counts, version: 2, revert_to_version: 1
  end
end
