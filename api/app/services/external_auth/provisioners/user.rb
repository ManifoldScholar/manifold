# frozen_string_literal: true

module ExternalAuth
  module Provisioners
    class User < Abstract
      before_provision :random_password

      with_options if: :facebook_or_google? do
        before_provision :name_to_nickname
        before_provision :first_and_last_name
      end

      before_provision :twitter_details, if: :twitter?
      before_provision :extract_custom_details!, if: :custom?

      def random_password
        user.password = user.password_confirmation = SecureRandom.hex(32)
      end

      def name_to_nickname
        user.nickname = auth_hash.info.name
      end

      def first_and_last_name
        user.assign_attributes(auth_hash.info.slice(*%w[first_name last_name]))
      end

      def twitter_details
        user.nickname = "@#{auth_hash.info.nickname}"
        user.name = auth_hash.info.name
      end

      # @return [void]
      def extract_custom_details!
        user.name = auth_hash.info["name"]
        user.nickname = auth_hash.info["nickname"] || auth_hash.info.first_name
      end
    end
  end
end
