module V1
  class AnnotationSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::IsCreator
    include ::V1::Concerns::WithAbilities

    attributes :created_at,
               :updated_at,
               :start_char,
               :start_node,
               :end_char,
               :end_node,
               :id,
               :flags_count,
               :format,
               :subject,
               :body,
               :private,
               :comments_count,
               :author_created,
               :reading_group_name,
               :reading_group_privacy,
               :reading_group_id,
               :creator_id,
               :project_id,
               :text_id,
               :text_section_id,
               :resource_id,
               :resource_collection_id,
               :text_slug,
               :project_title,
               :text_title,
               :text_title_formatted,
               :text_section_title,
               :is_anonymous

    attributes :orphaned, &:orphaned?

    attributes :is_anonymous do |object, params|
      anonymous?(object, params)
    end

    attributes :creator_name do |object, params|
      next object.creator.full_name if creator_identity_visible?(object, params)

      object.anonymous_label
    end

    attributes :creator_avatar_styles do |object, params|
      creator_identity_visible?(object, params) ? camelize_hash(object.creator_avatar_styles) : {}
    end

    attributes :flagged do |object, params|
      next 0 unless authenticated?(params)

      object.flags.where(creator: params[:current_user]).count.positive?
    end

    has_one :creator,
            if: proc { |object, params| creator_identity_visible?(object, params) },
            serializer: ::V1::UserSerializer

    class << self

      def moderator?(object, params)
        params[:current_user]&.can_update? object.reading_group
      end

      def creator_identity_visible?(object, params)
        not_anonymous?(object, params) || moderator?(object, params)
      end

      def not_anonymous?(object, params)
        !anonymous?(object, params)
      end

      def anonymous?(object, _params)
        object.reading_group_id && object.reading_group.anonymous?
      end

    end

  end
end
