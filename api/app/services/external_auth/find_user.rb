# frozen_string_literal: true

module ExternalAuth
  class FindUser < ActiveInteraction::Base
    include AuthAction

    attr_reader :user

    # @return [User]
    def execute
      byebug
      @user = find_user
    end

    def identity
      @identity ||= Identity.from_omniauth(auth_hash)
    end

    private

    # @return [User]
    def find_user
      if identity.new_record?
        compose ExternalAuth::UpsertUser, **inputs.merge(identity: identity)
      else
        identity.user
      end
    end
  end
end
