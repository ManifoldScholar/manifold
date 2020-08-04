require 'rails_helper'

RSpec.describe ExternalAuth::Provisioners::User, external_auth_provisioner: true do
  with_provider :facebook do
    upon_running_the_provisioner do
      expect_hooks! :name_to_nickname, :first_and_last_name

      the_user_has do
        mapped_from_auth nickname: :name
        copied_from_auth :first_name, :last_name
      end
    end
  end

  with_provider :google do
    upon_running_the_provisioner do
      expect_hooks! :name_to_nickname, :first_and_last_name

      the_user_has do
        mapped_from_auth nickname: :name
        copied_from_auth :first_name, :last_name
      end
    end
  end

  with_provider :twitter do
    upon_running_the_provisioner do
      expect_hooks! :twitter_details

      the_user_has do
        set_attributes("set the user's nickname to the twitter nickname") do
          { nickname: "@#{auth_hash.info.nickname}" }
        end

        set_attributes("set the user's name to the twitter name") do
          { name: auth_hash.info.name }
        end

      end
    end
  end
end
