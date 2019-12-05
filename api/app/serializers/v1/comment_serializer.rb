module V1
  class CommentSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer

    abilities
    typed_attribute :body, NilClass
    typed_attribute :parent_id, NilClass
    typed_attribute :created_at, NilClass
    typed_attribute :flags_count, NilClass
    typed_attribute :flagged, NilClass
    typed_attribute :deleted, NilClass
    typed_attribute :children_count, NilClass
    typed_attribute :sort_order, NilClass
    typed_attribute :author_created, NilClass
    typed_attribute :flagged, NilClass do |object, params|
      next 0 unless authenticated?(params)

      object.flagged_by?(params[:current_user])
    end
    typed_attribute :body, NilClass do |object, params|
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
