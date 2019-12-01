module V1
  class ReadingGroupMembershipSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::IsCreator

    attributes :annotations_count,
               :highlights_count,
               :anonymous_label,
               :is_current_user

    attributes :is_current_user do |object, params|
      current_user_is_object_user?(object, params)
    end

    attributes :name do |object, params|
      next object.user_full_name if not_anonymous?(object)
      next object.user.full_name if current_user_is_object_user?(object, params)
      next "#{object.user.full_name} (#{anonymous_label(object)})" if can_see_identity?(object, params)

      anonymous_label(object)
    end

    has_one :user, if: proc { |object, params|
      not_anonymous?(object) || can_see_identity?(object, params)
    }

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

    end

  end
end
