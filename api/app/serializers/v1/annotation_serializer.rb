module V1
  class AnnotationSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    current_user_is_creator?
    abilities

    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :updated_at, Types::DateTime.meta(read_only: true)
    typed_attribute :start_char, Types::Integer
    typed_attribute :start_node, Types::String.meta(example: "start")
    typed_attribute :end_char, Types::Integer
    typed_attribute :end_node, Types::String.meta(example: "end")
    typed_attribute :flags_count, Types::Integer.meta(read_only: true)
    typed_attribute :format, Types::String.enum("annotation", "highlight", "resource", "resource_collection")
    typed_attribute :subject, Types::String
    typed_attribute :body, Types::String.meta(description: "Only required if format is annotation")
    typed_attribute :private, Types::Bool
    typed_attribute :comments_count, Types::Integer.meta(read_only: true)
    typed_attribute :author_created, Types::Bool.meta(read_only: true)
    typed_attribute :reading_group_name, Types::String.optional.meta(read_only: true)
    typed_attribute :reading_group_privacy, Types::String.meta(read_only: true).optional
    typed_attribute :reading_group_id, Types::Serializer::ID.optional
    typed_attribute :creator_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :project_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :text_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :text_section_id, Types::Serializer::ID.meta(read_only: true)
    typed_attribute :resource_id, Types::Serializer::ID.optional.meta(read_only: true)
    typed_attribute :resource_collection_id, Types::Serializer::ID.optional.meta(read_only: true)
    typed_attribute :text_slug, Types::String.meta(read_only: true)
    typed_attribute :project_title, Types::String.meta(read_only: true)
    typed_attribute :text_title, Types::String.meta(read_only: true)
    typed_attribute :text_title_formatted, Types::String.optional.meta(read_only: true)
    typed_attribute :text_section_title, Types::String.optional.meta(read_only: true)
    typed_attribute :orphaned, Types::Bool.meta(read_only: true), &:orphaned?
    typed_attribute :is_anonymous, Types::Bool.optional.meta(read_only: true) do |object, params|
      anonymous?(object, params)
    end
    typed_attribute :creator_name, Types::String.meta(read_only: true) do |object, params|
      next object.creator&.full_name if creator_identity_visible?(object, params)

      object.anonymous_label
    end

    typed_attribute :annotation_style, Types::String.optional

    typed_attribute :creator_avatar_styles, Types::Serializer::Attachment.meta(read_only: true) do |object, params|
      creator_identity_visible?(object, params) ? camelize_hash(object.creator_avatar_styles) : {}
    end

    typed_attribute :flagged, Types::Bool.meta(read_only: true) do |object, params|
      next false unless authenticated?(params)

      object.flags.where(creator: params[:current_user]).count.positive?
    end

    typed_belongs_to :creator,
                     record_type: :user,
                     if: proc { |object, params| creator_identity_visible?(object, params) },
                     serializer: ::V1::UserSerializer

    typed_has_many :membership_comments, serializer: ::V1::CommentSerializer, record_type: "comment" do |object, params|
      rgm = params[:filters][:reading_group_membership]

      next [] if rgm.blank?

      object.filtered_membership_comments_for rgm
    end

    typed_attribute :annotation_node, Types::Hash do |object|
      object.annotation_node.node || {}
    end

    class << self

      def include_abilities?(_object, _params)
        true
      end

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
