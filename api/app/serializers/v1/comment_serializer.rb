module V1
  class CommentSerializer < ManifoldSerializer

    include ::V1::Concerns::ManifoldSerializer
    include ::V1::Concerns::WithCreator
    include ::V1::Concerns::WithAbilities

    attributes :body,
               :parent_id,
               :created_at,
               :flags_count,
               :flagged,
               :deleted,
               :children_count,
               :sort_order,
               :author_created

    attribute :flagged do |object, params|
      next 0 unless authenticated?(params)

      object.flagged_by?(params[:current_user])
    end

    attribute :body do |object, params|
      object.deleted == true ? deleted_body(object, params) : object.body
    end

    class << self
      def deleted_body(object, params)
        return object.body if params[:current_user]&.can_read_deleted?(object)

        nil
      end
    end

  end
end
