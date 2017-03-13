# Serializes an Annotation model
class AnnotationSerializer < ActiveModel::Serializer
  meta(partial: false)

  has_one :creator
  attributes :created_at, :end_char, :end_node, :id, :start_char, :start_node,
             :text_section_id, :updated_at, :format, :resource_id,
             :body, :private, :subject
end
