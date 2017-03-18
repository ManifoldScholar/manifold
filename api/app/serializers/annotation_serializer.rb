# Serializes an Annotation model
class AnnotationSerializer < ActiveModel::Serializer
  meta(partial: false)

  has_one :creator
  attributes :created_at, :end_char, :end_node, :id, :start_char, :start_node,
             :text_section_id, :updated_at, :format, :resource_id, :creator_id,
             :body, :private, :subject, :current_user_is_creator

  def current_user_is_creator
    scope.authenticated_as.id == object.creator_id
  end

end
