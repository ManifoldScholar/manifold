module Notifications
  class NotifyThreadProjectEditorsJob < ApplicationJob
    REPLY_TYPES = [NotificationKind[:project_comments_and_annotations],
                   NotificationKind[:replies_to_me]].freeze

    def perform(participants, reply)
      return unless participants.present?

      participants.each do |participant|
        next unless participant.wants_notifications_for? REPLY_TYPES
        NotificationMailer.comment_notification(participant, reply).deliver
      end
    end
  end
end
