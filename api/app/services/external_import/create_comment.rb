module ExternalImport
  class CreateComment < ActiveInteraction::Base
    object :annotation

    object :parent, class: "Comment", default: nil

    boolean :anonymous

    string :user_id, default: nil

    string :body

    time :created_at
    time :updated_at

    array :comments, default: proc { [] } do
      hash strip: false
    end

    # @return [Comment]
    def execute
      comment = create_comment!

      comments.each do |definition|
        compose self.class, inputs.merge(definition).merge(parent: comment)
      end

      comment
    end

    private

    def create_comment!
      user = find_user!

      shared_attributes = {
        body: body,
        creator: user
      }

      timestamps = proc do |comment|
        comment.assign_attributes(inputs.slice(:created_at, :updated_at))
      end

      if parent?
        parent.children.where(shared_attributes.merge(subject: annotation)).first_or_create!(&timestamps)
      else
        annotation.comments.where(shared_attributes).first_or_create!(&timestamps)
      end
    end

    # @return [User]
    def find_user!
      anonymous || user_id.blank? ? User.anonymous_user : User.where(import_source_id: user_id).first!
    end
  end
end
