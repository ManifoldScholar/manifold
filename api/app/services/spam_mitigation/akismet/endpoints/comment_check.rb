# frozen_string_literal: true

module SpamMitigation
  module Akismet
    module Endpoints
      class CommentCheck < Base
        endpoint "/1.1/comment-check"

        params_klass SpamMitigation::Akismet::Params::CommentCheck

        param :comment_content, Types::String

        option :comment_type, Types::String, default: proc { "comment" }

        def handle_response(response)
          yield super

          case response.body
          when /true/i
            Success SPAM
          when /false/i
            Success NOT_SPAM
          else
            # :nocov:
            Failure[:indeterminate_response, response]
            # :nocov:
          end
        end
      end
    end
  end
end
