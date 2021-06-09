class CreateAnnotationMembershipComments < ActiveRecord::Migration[6.0]
  def change
    create_view :annotation_membership_comments
  end
end
