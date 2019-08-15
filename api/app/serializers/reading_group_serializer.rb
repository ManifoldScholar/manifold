class ReadingGroupSerializer < ApplicationSerializer

  meta(partial: false)

  attributes :name, :privacy, :invitation_code, :notify_on_join, :memberships_count,
             :all_annotations_count, :annotations_count, :highlights_count, :created_at,
             :current_user_role, :current_user_is_creator, :creator_id

  def current_user_role
    current_user_is_creator ? "owner" : "members"
  end

end
