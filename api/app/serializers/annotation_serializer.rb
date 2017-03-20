# Serializes an Annotation model
class AnnotationSerializer < ActiveModel::Serializer
  include Authorization
  meta(partial: false)

  has_one :creator
  attributes :created_at, :end_char, :end_node, :id, :start_char, :start_node,
             :text_section_id, :updated_at, :format, :resource_id, :creator_id,
             :body, :private, :subject, :current_user_is_creator, :can_update_object,
             :can_delete_object

  def current_user_is_creator
    user_id = scope.try(:authenticated_as).try(:id)
    return false unless user_id
    return false unless object.creator_id
    user_id == object.creator_id
  end

end
