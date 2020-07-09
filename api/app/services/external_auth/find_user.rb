module ExternalAuth
  class FindUser < ActiveInteraction::Base
    include AuthAction

    attr_reader :identity, :user

    # @return [User]
    def execute
      @identity = Identity.from_omniauth(auth_hash)

      @user = find_user
    end

    private

    # @return [User]
    def find_user
      if @identity.new_record?
        compose ExternalAuth::UpsertUser, inputs.merge(identity: identity)
      else
        @identity.user
      end
    end
  end
end
