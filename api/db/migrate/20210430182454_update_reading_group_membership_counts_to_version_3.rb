class UpdateReadingGroupMembershipCountsToVersion3 < ActiveRecord::Migration[6.0]
  def change
    update_view :reading_group_membership_counts, version: 3, revert_to_version: 2

    add_index :annotations, %i[id creator_id reading_group_id format orphaned], name: :index_annotations_for_membership_counts
    add_index :comments, %i[id subject_type subject_id creator_id], name: :index_comments_on_annotations_by_user, where: %[subject_type = 'Annotation']
  end
end
