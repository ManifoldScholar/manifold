class CreateAnnotationReadingGroupMemberships < ActiveRecord::Migration[6.0]
  def change
    create_view :annotation_reading_group_memberships
  end
end
