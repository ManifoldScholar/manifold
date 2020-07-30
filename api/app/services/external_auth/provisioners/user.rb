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
        user.nickname = auth_info.name
      end

      def first_and_last_name
        # TODO: should use assign_attributes
        auth_info.slice("first_name", "last_name").each do |(attr, value)|
          user[attr] = value
        end
      end

      # @note Limitation of the twitter API: we cannot currently
      #   get first & last name from the data fetched by omniauth
      def twitter_details
        user.nickname = "@#{auth_info.nickname}"
        user.first_name = "Twitter"
        user.last_name = "User"
      end

      # @return [void]
      def extract_custom_details!
        user.first_name = auth_info["first_name"]
        user.last_name = auth_info["last_name"]
        user.nickname = auth_info["nickname"]
      end
    end
  end
end
