module V1
  class ReadingGroupSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities

    typed_attribute :name, Types::String
    typed_attribute :privacy, Types::String.enum("public", "private", "anonymous")
    typed_attribute :invitation_code, Types::String.meta(example: "E80RSYY6", unique: true)
    typed_attribute :notify_on_join, Types::Bool
    typed_attribute :memberships_count, Types::Integer.meta(read_only: true)
    typed_attribute :annotations_count, Types::Integer.meta(read_only: true)
    typed_attribute :highlights_count, Types::Integer.meta(read_only: true)
    typed_attribute :comments_count, Types::Integer.meta(read_only: true)
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :creator_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :course, Types::Hash.schema(
      enabled: Types::Bool,
      starts_on: Types::Date.optional,
      ends_on: Types::Date.optional
    ) do |object, _params|
      object.course.as_json
    end

    typed_attribute :all_annotations_count, Types::Integer.meta(read_only: true) do |object, _params|
      object.annotations_count + object.highlights_count
    end

    typed_attribute :current_user_counts, Users::ReadingGroupCount::SCHEMA.meta(read_only: true) do |object, params|
      params[:current_user].then do |user|
        next Users::ReadingGroupCount.new if user.blank? || user.anonymous?

        user.reading_group_count_for object
      end.as_json
    end

    typed_attribute :current_user_role, Types::String.enum("moderator", "member", "none").meta(read_only: true) do |object, params|
      if calculate_current_user_is_creator?(object, params)
        "moderator"
      else
        rgm = object.reading_group_membership_for_user(params[:current_user])

        rgm ? rgm.role.to_s : "none"
      end
    end

    typed_attribute :invitation_url, Types::Serializer::URL.meta(read_only: true) do |object, _params|
      ClientURL.call(:join_reading_group, invitation_code: object.invitation_code)
    end

    typed_has_many :annotated_texts, serializer: TextOptionsSerializer, record_type: "textOptions"

    typed_has_many :reading_group_memberships do |object, params|
      if ReadingGroupMembership.readable_by?(params[:current_user], reading_group: object)
        object.reading_group_memberships
      else
        object.reading_group_memberships.none
      end
    end

    typed_has_one :current_user_reading_group_membership, serializer: V1::ReadingGroupMembershipSerializer,
                  record_type: "readingGroupMemberships" do |object, params|
      object.reading_group_membership_for_user params[:current_user]
    end

    typed_has_one :collection, serializer: V1::ReadingGroupCollectionSerializer, record_type: "readingGroupCollection" do |object, _|
      object.composed_collection
    end

    typed_has_one :kind, serializer: V1::ReadingGroupKindSerializer do |object, _params|
      object.reading_group_kind
    end

    link_with_meta :clone, if: guard_user_authorized_to(:update), method: "POST" do |object, _params|
      routes.clone_api_v1_reading_group_path(object)
    end

    CAN_JOIN = ->(object, params) do
      next unless params[:current_user].present?
      next unless object.public?

      !ReadingGroupMembership.where(reading_group: object, user: params[:current_user]).exists?
    end

    link_with_meta :join, if: CAN_JOIN, method: "POST" do |object, _params|
      routes.join_api_v1_reading_group_path(object)
    end

    SHOW_ARCHIVE_LINK = ->(reading_group, params) do
      next false unless params[:current_user].present?

      membership = reading_group.membership_for params[:current_user]

      next false unless membership.present? && membership.may_archive?

      params[:current_user].can_update?(membership)
    end

    link :archive, if: SHOW_ARCHIVE_LINK do |reading_group, params|
      membership = reading_group.membership_for params[:current_user]

      next nil if membership.blank?

      routes.archive_api_v1_reading_group_membership_path(membership)
    end
  end
end
