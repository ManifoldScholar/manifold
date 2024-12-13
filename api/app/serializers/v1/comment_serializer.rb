# frozen_string_literal: true

module V1
  class CommentSerializer < ManifoldSerializer
    include ::V1::Concerns::ManifoldSerializer

    FLAG_METADATA_VISIBLE = ->(object, params) { flag_metadata_visible?(object, params) }

    abilities
    typed_attribute :parent_id, Types::Serializer::ID.optional
    typed_attribute :created_at, Types::DateTime.meta(read_only: true)
    typed_attribute :deleted, Types::Bool
    typed_attribute :children_count, Types::Integer.meta(read_only: true)
    typed_attribute :sort_order, Types::Integer.meta(read_only: true)
    typed_attribute :author_created, Types::Bool.meta(read_only: true)
    typed_attribute :body, Types::String do |object, params|
      object.deleted == true ? deleted_body(object, params) : object.body
    end

    typed_attribute(:flagged, Types::Bool.meta(read_only: true)) do |object, params|
      object.flagged_by?(params[:current_user])
    end

    typed_has_many :flags, serializer: ::V1::FlagSerializer, record_type: "flag", if: FLAG_METADATA_VISIBLE

    ::FlagStatus::COUNTS.each do |attr|
      typed_attribute attr, Types::Integer.meta(read_only: true), if: FLAG_METADATA_VISIBLE
    end

    has_one_creator

    class << self
      def flag_metadata_visible?(_object, params)
        admin?(params)
      end

      def include_abilities?(_object, _params)
        true
      end

      def deleted_body(object, params)
        return object.body if params[:current_user]&.can_read_deleted?(object)

        nil
      end
    end
  end
end
