module Notifications
  class NotifyCommentParentAuthors < ActiveInteraction::Base
    object :comment

    delegate :parent, to: :comment
    delegate :creator, to: :comment
    delegate :subject, to: :comment
    delegate :subject_type, to: :comment
    delegate :on_annotation?, to: :comment

    def execute
      notify_parent_creator!
      notify_subject_creator!
    end

    private

    # A comment's direct parent
    def notify_parent_creator!
      return unless parent.present?
      return if reply_to_self?
      return unless creator_wants_notification? parent.creator
      send_notification parent.creator
    end

    # A thread's origin.  Currently only sending if thread stems from an Annotation.
    def notify_subject_creator!
      return unless on_annotation?
      return unless creator_wants_notification? subject.creator

      send_notification subject.creator
    end

    def reply_to_self?
      parent.creator == creator
    end

    def creator_wants_notification?(creator)
      creator.wants_notifications_for? NotificationKind[:replies_to_me]
    end

    def send_notification(recipient)
      NotificationMailer.reply_notification(recipient, comment).deliver
    end

  end
end
