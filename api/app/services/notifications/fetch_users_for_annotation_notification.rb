module Notifications
  class FetchUsersForAnnotationNotification < ActiveInteraction::Base
    record :annotation

    delegate :creator, to: :annotation

    def execute
      return [] if annotation.private?

      editors = User.receiving_comment_notifications_for annotation.project

      editors.select do |editor|
        next false if editor == creator

        editor.wants_notifications_for?(:project_comments_and_annotations)
      end
    end
  end
end
