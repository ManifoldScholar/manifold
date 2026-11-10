# frozen_string_literal: true

module ExternalAuth
  class FindUser < ActiveInteraction::Base
    include AuthAction

    attr_reader :user

    def execute
      return if account_linking_required?

      @user = find_user
    end

    def identity
      @identity ||= Identity.from_omniauth(auth_hash)
    end

    # Does a new identity's email match an existing account?
    def account_linking_required?
      super && identity.new_record? && linkable_user.present?
    end

    def linkable_user
      return @linkable_user if defined?(@linkable_user)

      email = auth_hash.info.email
      @linkable_user = email.present? ? User.find_by(email: email) : nil
    end

    private

    def find_user
      if identity.new_record?
        compose ExternalAuth::UpsertUser, **inputs, identity: identity
      else
        identity.user
      end
    end
  end
end
