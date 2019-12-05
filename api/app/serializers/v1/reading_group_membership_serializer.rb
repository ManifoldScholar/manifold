module V1
  class ReadingGroupMembershipSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    current_user_is_creator?

    typed_attribute :annotations_count, NilClass
    typed_attribute :highlights_count, NilClass
    typed_attribute :anonymous_label, NilClass
    typed_attribute :is_current_user, NilClass
    typed_attribute :is_current_user, NilClass do |object, params|
      current_user_is_object_user?(object, params)
    end

    typed_attribute :name, NilClass do |object, params|
      next object.user_full_name if not_anonymous?(object)
      next object.user.full_name if current_user_is_object_user?(object, params)
      next "#{object.user.full_name} (#{anonymous_label(object)})" if can_see_identity?(object, params)

      anonymous_label(object)
    end

    typed_has_one :user, if: proc { |object, params|
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
