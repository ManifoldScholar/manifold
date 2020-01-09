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
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :creator_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :texts, Types::Array.of(Types::String).meta(read_only: true)
    typed_attribute :all_annotations_count, Types::Integer.meta(read_only: true) do |object, _params|
      object.annotations_count + object.highlights_count
    end

    typed_attribute :current_user_role, Types::String.enum("moderator", "member").meta(read_only: true) do |object, params|
      calculate_current_user_is_creator?(object, params) ? "moderator" : "member"
    end

    typed_attribute :invitation_url, Types::Serializer::URL.meta(read_only: true) do |object, _params|
      ClientURL.call(:join_reading_group, invitation_code: object.invitation_code)
    end

    typed_has_many :texts, serializer: TextOptionsSerializer
    typed_has_many :reading_group_memberships

  end
end
