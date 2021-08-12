module Notifications
  class FetchUsersForCommentNotification < ActiveInteraction::Base
    record :comment

    delegate :creator, to: :comment
    delegate :parent, to: :comment
    delegate :subject, to: :comment

    def execute
      editors = User.receiving_comment_notifications_for subject

      editors.select do |editor|
        next false if editor.in? excluded

        editor.wants_notifications_for?(:project_comments_and_annotations)
      end
    end

    private

    def excluded
      @excluded ||= [creator].tap do |out|
        out << parent.creator if parent&.creator.present?
      end.compact
    end
  end
end
