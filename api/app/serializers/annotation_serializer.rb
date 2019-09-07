# Serializes an Annotation model
class AnnotationSerializer < ApplicationSerializer

  meta(partial: false)

  has_one :creator
  has_one :text_section
  has_one :reading_group

  attributes :created_at, :end_char, :end_node, :id, :start_char, :start_node,
             :text_section_id, :updated_at, :format, :subject, :abilities, :resource_id,
             :creator_id, :body, :private, :comments_count, :resource_collection_id,
             :author_created, :current_user_is_creator, :orphaned, :reading_group_id,
             :flagged, :flags_count, :text_id

  def text_id
    object.text_section.text_id
  end

  def creator
    return object.creator unless object.reading_group_id && object.reading_group.anonymous?
    return object.creator if current_user&.can_update? object.reading_group

    nil
  end

  def orphaned
    object.orphaned?
  end

  def flagged
    return 0 unless authenticated?

    object.flags.where(creator: current_user).count.positive?
  end
end
