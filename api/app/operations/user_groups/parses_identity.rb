# frozen_string_literal: true

module UserGroups
  module ParsesIdentity
    extend ActiveSupport::Concern

    included do
      attr_reader :identity, :user, :user_or_identity
    end

    def parse_user_or_identity(user_or_identity)
      @user_or_identity ||= user_or_identity
      case user_or_identity
      when User
        @user = user_or_identity
      when Identity
        @identity = user_or_identity
        @user = user_or_identity.user
      end
    end
  end
end
