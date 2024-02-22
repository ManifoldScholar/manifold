# frozen_string_literal: true

module SpamMitigation
  module Akismet
    module Endpoints
      class SubmitSpam < Base
        endpoint "/1.1/submit-spam"

        # @note Uses the same params as `comment-check`.
        params_klass SpamMitigation::Akismet::Params::CommentCheck

        param :comment_content, Types::String

        option :comment_type, Types::String, default: proc { "comment" }
      end
    end
  end
end
