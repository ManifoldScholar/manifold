# frozen_string_literal: true

module SpamMitigation
  module Akismet
    module Params
      # Params for submitting comment-related requests.
      #
      # @see https://akismet.com/developers/detailed-docs/comment-check/
      # @see https://akismet.com/developers/detailed-docs/submit-spam-missed-spam/
      class CommentCheck < SpamMitigation::Akismet::Params::Base
        accepts_user!

        sends_blog!

        extracts_user_comment_author_info!

        sliced_attribute :comment_content, Types::String

        sliced_attribute? :comment_type, Types::String.default { "comment" }
      end
    end
  end
end
