class ReadingGroupMembershipDecorator < ApplicationDecorator

  delegate_all

  def member_full_name
    object.user.full_name
  end

  def reading_group_name
    object.reading_group.name
  end

  def created_at
    object.created_at.strftime("%B %-d, %Y")
  end

  def count
    object.reading_group.reading_group_memberships.count
  end

end
