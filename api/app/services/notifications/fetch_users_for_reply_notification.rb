module Notifications
  class FetchUsersForReplyNotification < ActiveInteraction::Base
    record :comment

    delegate :parent, to: :comment
    delegate :creator, to: :comment
    delegate :subject, to: :comment
    delegate :on_annotation?, to: :comment
    delegate :reply_to_self?, to: :comment

    def execute
      recipients = []
      recipients.push(parent.creator) if notify_parent_creator?
      recipients.push(subject.creator) if notify_subject_creator?
      recipients
    end

    def notify_parent_creator?
      parent.present? && !reply_to_self? && creator_wants_notification?(parent.creator)
    end

    def notify_subject_creator?
      on_annotation? && creator_wants_notification?(subject.creator)
    end

    private

    def creator_wants_notification?(creator)
      creator.wants_notifications_for? NotificationKind[:replies_to_me]
    end

  end
end
