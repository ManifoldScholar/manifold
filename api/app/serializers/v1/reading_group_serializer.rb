module V1
  class ReadingGroupSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithAbilities

    attributes :name,
               :privacy,
               :invitation_code,
               :notify_on_join,
               :memberships_count,
               :annotations_count,
               :highlights_count,
               :created_at,
               :current_user_role,
               :creator_id,
               :texts

    attributes :all_annotations_count do |object, _params|
      object.annotations_count + object.highlights_count
    end

    attributes :current_user_role do |object, params|
      current_user_is_creator?(object, params) ? "moderator" : "member"
    end

    attributes :invitation_url do |object, _params|
      ClientURL.call(:join_reading_group, invitation_code: object.invitation_code)
    end

    has_many :texts, serializer: TextOptionsSerializer
    has_many :reading_group_memberships

  end
end
