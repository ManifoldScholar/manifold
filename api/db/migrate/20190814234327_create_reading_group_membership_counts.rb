class CreateReadingGroupMembershipCounts < ActiveRecord::Migration[5.2]
  def change
    create_view :reading_group_membership_counts
  end
end
