module ExternalImport
  class CreateAnnotation < ActiveInteraction::Base
    object :text_section

    string :start_node

    string :end_node

    integer :start_char

    integer :end_char

    string :type, default: "annotation"

    string :selection

    boolean :anonymous

    string :user_id, default: nil

    string :body, default: nil

    time :created_at

    time :updated_at

    # @return [Annotation]
    def execute
      user = find_user!

      attributes = inputs.slice(
        :start_node, :end_node,
        :start_char, :end_char,
        :text_section,
        :body
      ).merge(
        creator: user,
        format: type,
        subject: selection
      )

      annotation = Annotation.where(attributes).first_or_create! do |a|
        a.assign_attributes(inputs.slice(:created_at, :updated_at))
      end

      compose Annotations::AdoptOrOrphan, annotation: annotation
    end

    private

    # @return [User]
    def find_user!
      anonymous ? User.anonymous_user : User.where(import_source_id: user_id).first!
    end
  end
end
