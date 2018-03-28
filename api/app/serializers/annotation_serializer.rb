# Serializes an Annotation model
class AnnotationSerializer < ApplicationSerializer

  meta(partial: false)

  has_one :creator
  has_one :text_section, serializer: TextSectionPartialSerializer

  attributes :created_at, :end_char, :end_node, :id, :start_char, :start_node,
             :text_section_id, :updated_at, :format, :subject, :abilities, :resource_id,
             :creator_id, :body, :private, :comments_count, :collection_id,
             :author_created, :current_user_is_creator

end
