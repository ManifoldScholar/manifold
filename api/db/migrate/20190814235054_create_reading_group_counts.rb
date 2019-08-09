class CreateReadingGroupCounts < ActiveRecord::Migration[5.2]
  def change
    create_view :reading_group_counts
  end
end
