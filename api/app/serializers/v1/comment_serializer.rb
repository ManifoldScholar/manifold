module V1
  class CommentSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities
    typed_attribute :parent_id, Types::Serializer::ID.optional
    typed_attribute :created_at, Types::DateTime
    typed_attribute :flags_count, Types::Integer
    typed_attribute :deleted, Types::Bool
    typed_attribute :children_count, Types::Integer
    typed_attribute :sort_order, Types::Integer
    typed_attribute :author_created, Types::Bool
    typed_attribute :flagged, Types::Bool do |object, params|
      next 0 unless authenticated?(params)

      object.flagged_by?(params[:current_user])
    end
    typed_attribute :body, Types::String do |object, params|
      object.deleted == true ? deleted_body(object, params) : object.body
    end

    has_one_creator

    class << self
      def deleted_body(object, params)
        return object.body if params[:current_user]&.can_read_deleted?(object)

        nil
      end
    end

  end
end
