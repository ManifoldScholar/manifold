# Serializes an Annotation model
class AnnotationSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :created_at, :end_char, :end_node, :id, :start_char, :start_node,
             :text_section_id, :updated_at, :creator_id, :format, :resource_id
end
