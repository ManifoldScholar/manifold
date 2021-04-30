module V1
  class ReadingGroupMembershipSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    typed_belongs_to :reading_group
    typed_has_one :user, if: ->(object, params) { has_visible_user?(object, params) }

    typed_attribute :annotation_style, Types::String

    typed_attribute :label, Types::String

    typed_attribute :annotations_count, Types::Integer.meta(read_only: true)
    typed_attribute :comments_count, Types::Integer.meta(read_only: true)
    typed_attribute :highlights_count, Types::Integer.meta(read_only: true)
    typed_attribute :anonymous_label, Types::String.meta(read_only: true)
    typed_attribute :is_current_user, Types::Bool.meta(read_only: true) do |object, params|
      current_user_is_object_user?(object, params)
    end

    typed_attribute :name, Types::String.meta(read_only: true) do |object, params|
      next object.user_full_name if not_anonymous?(object)
      next object.user.full_name if current_user_is_object_user?(object, params)
      next "#{object.user.full_name} (#{anonymous_label(object)})" if can_see_identity?(object, params)

      anonymous_label(object)
    end

    typed_attribute :role, Types::String

    typed_attribute :state, Types::String.meta(read_only: true) do |object|
      object.aasm_state
    end

    SHOW_ACTIVATE_LINK = ->(object, params) do
      next false unless object.may_activate?
      next false unless params[:current_user].present?

      params[:current_user].can_update?(object)
    end

    link :activate, if: SHOW_ACTIVATE_LINK do |object|
      routes.activate_api_v1_reading_group_membership_path(object)
    end

    SHOW_ARCHIVE_LINK = ->(object, params) do
      next false unless object.may_archive?
      next false unless params[:current_user].present?

      params[:current_user].can_update?(object)
    end

    link :archive, if: SHOW_ARCHIVE_LINK do |object|
      routes.archive_api_v1_reading_group_membership_path(object)
    end

    class << self
      def not_anonymous?(object)
        !object.reading_group_anonymous?
      end

      def can_see_identity?(object, params)
        return true if not_anonymous?(object)

        current_user_is_object_user?(object, params) ||
          current_user_can_update?(object.reading_group, params)
      end

      def anonymous_label(object)
        object.anonymous_label || "Anonymous"
      end

      def has_visible_user?(object, params)
        not_anonymous?(object) || can_see_identity?(object, params)
      end
    end
  end
end
