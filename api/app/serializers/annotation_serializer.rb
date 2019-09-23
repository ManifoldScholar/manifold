# Serializes an Annotation model
class AnnotationSerializer < ApplicationSerializer

  meta(partial: false)

  has_one :creator

  attributes :created_at, :updated_at, :start_char, :start_node, :end_char,
             :end_node, :id, :flagged, :flags_count, :format, :subject, :body, :private,
             :comments_count, :author_created, :current_user_is_creator, :orphaned,
             :reading_group_name, :reading_group_privacy, :reading_group_id,
             :creator_id, :project_id, :text_id, :text_section_id, :resource_id,
             :resource_collection_id, :text_slug, :project_title, :text_title,
             :text_title_formatted, :text_section_title, :creator_name,
             :creator_avatar_styles, :abilities, :is_anonymous

  def creator_name
    creator_identity_visible? ? object.creator.full_name : object.anonymous_label
  end

  def creator_avatar_styles
    creator_identity_visible? ? object.creator_avatar_styles : {}
  end

  def creator
    creator_identity_visible? ? object.creator : nil
  end

  def orphaned
    object.orphaned?
  end

  def flagged
    return 0 unless authenticated?

    object.flags.where(creator: current_user).count.positive?
  end

  # rubocop:disable Naming/PredicateName
  def is_anonymous
    anonymous?
  end
  # rubocop:enable Naming/PredicateName

  private

  def moderator?
    current_user&.can_update? object.reading_group
  end

  def creator_identity_visible?
    not_anonymous? || moderator?
  end

  def not_anonymous?
    !anonymous?
  end

  def anonymous?
    object.reading_group_id && object.reading_group.anonymous?
  end

end
