module Notifications
  class NotifyCommentProjectEditorsJob < ApplicationJob

    def perform(comment)
      return unless comment.present?
      Notifications::NotifyCommentProjectEditors.run comment: comment
    end

  end
end
