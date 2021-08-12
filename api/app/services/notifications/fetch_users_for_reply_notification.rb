module Notifications
  class FetchUsersForReplyNotification < ActiveInteraction::Base
    record :comment

    delegate :parent, to: :comment
    delegate :creator, to: :comment
    delegate :subject, to: :comment
    delegate :on_annotation?, to: :comment
    delegate :reply_to_self?, to: :comment

    def execute
      [].tap do |recipients|
        recipients.push(parent.creator) if notify_parent_creator? && parent.creator.present?
        recipients.push(subject.creator) if notify_subject_creator? && subject.creator.present?
      end
    end

    def notify_parent_creator?
      parent.present? && !reply_to_self? && parent.creator.present? && creator_wants_notification?(parent.creator)
    end

    def notify_subject_creator?
      on_annotation? && subject.creator && creator_wants_notification?(subject.creator)
    end

    private

    def creator_wants_notification?(creator)
      creator.wants_notifications_for? NotificationKind[:replies_to_me]
    end
  end
end
