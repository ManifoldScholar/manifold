class ReadingGroupMembershipSerializer < ApplicationSerializer

  meta(partial: false)

  attributes :id, :annotations_count, :highlights_count, :anonymous_label, :name,
             :is_creator, :is_current_user
  has_one :user

  # rubocop:disable Metrics/AbcSize
  def name
    return object.user.full_name if is_not_anonymous?
    return object.user.full_name if is_current_user?
    return "#{object.user.full_name} (#{anonymous_label})" if can_see_identity?

    object.anonymous_label
  end
  # rubocop:enable Metrics/AbcSize

  def user
    return object.user if is_not_anonymous?
    return object.user if can_see_identity?

    nil
  end

  # rubocop:disable Naming/PredicateName
  def is_creator
    object.creator?
  end

  def is_current_user
    is_current_user?
  end
  # rubocop:enable Naming/PredicateName

  private

  # rubocop:disable Naming/PredicateName
  def is_not_anonymous?
    !object.reading_group.anonymous?
  end

  def is_current_user?
    object.user == current_user
  end

  def can_see_identity?
    return true if is_not_anonymous?

    is_current_user? || current_user&.can_update?(object.reading_group)
  end
  # rubocop:enable Naming/PredicateName

  def anonymous_label
    object.anonymous_label || "Anonymous"
  end

end
