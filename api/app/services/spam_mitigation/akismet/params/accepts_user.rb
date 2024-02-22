# frozen_string_literal: true

module SpamMitigation
  module Akismet
    module Params
      # Params that accept an optional user and extract information from them
      module AcceptsUser
        extend ActiveSupport::Concern

        included do
          attribute? :user, Types.Instance(User).optional
        end

        def has_user?
          user.present?
        end

        # @api private
        # @return [void]
        def extract_user_comment_author_info!
          comment_author_info = {
            comment_author: user.name,
            comment_author_email: user.email,
          }.compact_blank

          @body.merge! comment_author_info
        end

        module ClassMethods
          # @return [void]
          def extracts_user_comment_author_info!
            after_build :extract_user_comment_author_info!, if: :has_user?
          end
        end
      end
    end
  end
end
