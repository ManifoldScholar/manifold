module Notifications
  class SendReadingGroupJoinNotificationJob < ApplicationJob

    # @param [String] user_id
    # @param [String] flag_id
    def perform(user_id, reading_group_membership_id)
      user = User.find(user_id)
      reading_group_membership = ReadingGroupMembership.find(reading_group_membership_id)
      raise ActiveRecord::RecordNotFound unless reading_group_membership.present?

      NotificationMailer.reading_group_join_notification(user, reading_group_membership).deliver
    rescue ActiveRecord::RecordNotFound
      Rails.logger.error("ActiveRecord::RecordNotFound error in SendReadingGroupJoinNotificationJob")
      Rails.logger.error(
        "  Failed to notify #<User:#{user_id}> of Reading Group Join #<ReadingGroupMembership:#{reading_group_membership_id}>"
      )
    end

  end
end
