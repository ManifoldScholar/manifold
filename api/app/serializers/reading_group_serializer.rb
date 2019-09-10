class ReadingGroupSerializer < ApplicationSerializer

  meta(partial: false)

  attributes :name, :privacy, :invitation_code, :notify_on_join, :memberships_count,
             :all_annotations_count, :annotations_count, :highlights_count, :created_at,
             :current_user_role, :current_user_is_creator, :creator_id, :invitation_url,
             :abilities, :texts

  has_many :texts, serializer: TextOptionsSerializer
  has_many :reading_group_memberships

  def all_annotations_count
    object.annotations_count + object.highlights_count
  end

  def current_user_role
    current_user_is_creator ? "owner" : "member"
  end

  def invitation_url
    ClientURL.call(:join_reading_group, invitation_code: object.invitation_code)
  end

end
