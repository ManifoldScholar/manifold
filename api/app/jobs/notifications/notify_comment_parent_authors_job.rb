module Notifications
  class NotifyCommentParentAuthorsJob < ApplicationJob

    def perform(comment)
      return unless comment.present?
      Notifications::NotifyCommentParentAuthors.run comment: comment
    end

  end
end
