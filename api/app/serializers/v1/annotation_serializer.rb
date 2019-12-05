module V1
  class AnnotationSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    current_user_is_creator?
    abilities

    typed_attribute :created_at, NilClass
    typed_attribute :updated_at, NilClass
    typed_attribute :start_char, NilClass
    typed_attribute :start_node, NilClass
    typed_attribute :end_char, NilClass
    typed_attribute :end_node, NilClass
    typed_attribute :id, NilClass
    typed_attribute :flags_count, NilClass
    typed_attribute :format, NilClass
    typed_attribute :subject, NilClass
    typed_attribute :body, NilClass
    typed_attribute :private, NilClass
    typed_attribute :comments_count, NilClass
    typed_attribute :author_created, NilClass
    typed_attribute :reading_group_name, NilClass
    typed_attribute :reading_group_privacy, NilClass
    typed_attribute :reading_group_id, NilClass
    typed_attribute :creator_id, NilClass
    typed_attribute :project_id, NilClass
    typed_attribute :text_id, NilClass
    typed_attribute :text_section_id, NilClass
    typed_attribute :resource_id, NilClass
    typed_attribute :resource_collection_id, NilClass
    typed_attribute :text_slug, NilClass
    typed_attribute :project_title, NilClass
    typed_attribute :text_title, NilClass
    typed_attribute :text_title_formatted, NilClass
    typed_attribute :text_section_title, NilClass
    typed_attribute :is_anonymous, NilClass
    typed_attribute :orphaned, NilClass, &:orphaned?
    typed_attribute :is_anonymous, NilClass do |object, params|
      anonymous?(object, params)
    end
    typed_attribute :creator_name, NilClass do |object, params|
      next object.creator.full_name if creator_identity_visible?(object, params)

      object.anonymous_label
    end

    typed_attribute :creator_avatar_styles, Hash do |object, params|
      creator_identity_visible?(object, params) ? camelize_hash(object.creator_avatar_styles) : {}
    end

    typed_attribute :flagged, NilClass do |object, params|
      next 0 unless authenticated?(params)

      object.flags.where(creator: params[:current_user]).count.positive?
    end

    typed_belongs_to :creator,
                     record_type: :user,
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
