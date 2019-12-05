module V1
  class ReadingGroupSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :name, NilClass
    typed_attribute :privacy, NilClass
    typed_attribute :invitation_code, NilClass
    typed_attribute :notify_on_join, NilClass
    typed_attribute :memberships_count, NilClass
    typed_attribute :annotations_count, NilClass
    typed_attribute :highlights_count, NilClass
    typed_attribute :created_at, NilClass
    typed_attribute :current_user_role, NilClass
    typed_attribute :creator_id, NilClass
    typed_attribute :texts, NilClass
    typed_attribute :all_annotations_count, NilClass do |object, _params|
      object.annotations_count + object.highlights_count
    end

    typed_attribute :current_user_role, NilClass do |object, params|
      calculate_current_user_is_creator?(object, params) ? "moderator" : "member"
    end

    typed_attribute :invitation_url, NilClass do |object, _params|
      ClientURL.call(:join_reading_group, invitation_code: object.invitation_code)
    end

    typed_has_many :texts, serializer: TextOptionsSerializer
    typed_has_many :reading_group_memberships

  end
end
