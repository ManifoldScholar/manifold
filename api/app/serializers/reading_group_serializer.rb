class ReadingGroupSerializer < ApplicationSerializer

  meta(partial: false)

  attributes :name, :privacy, :invitation_code, :notify_on_join, :memberships_count,
             :all_annotations_count, :annotations_count, :highlights_count, :created_at,
             :role

  def role
    return "owner" if object.creator == current_user
    return "member"
  end




end
