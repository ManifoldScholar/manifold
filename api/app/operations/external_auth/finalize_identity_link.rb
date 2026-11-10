# frozen_string_literal: true

module ExternalAuth
  # Attaches a stored external identity to a user if the stored and authenticated users match.
  class FinalizeIdentityLink
    include Dry::Monads[:result]

    def initialize(account_link_token, authenticated_user)
      @account_link_token = account_link_token
      @authenticated_user = authenticated_user
    end

    # @return [Dry::Monads::Result] Success carries the linked :user and the :auth_hash.
    def call
      return Failure(:expired) if pending_link.blank?
      return Failure(:ownership_mismatch) unless pending_link.owned_by?(authenticated_user)

      attach_identity!
      Identities::HandleExternalAuth.new.call(identity, auth_hash)
      pending_link.consume!

      Success(user: authenticated_user, auth_hash: auth_hash)
    end

    private

    attr_reader :account_link_token, :authenticated_user

    def attach_identity!
      authenticated_user.identities << identity if identity.new_record?
    end

    def identity
      @identity ||= Identity.from_omniauth(auth_hash)
    end

    def auth_hash
      @auth_hash ||= pending_link.auth_hash
    end

    def pending_link
      return @pending_link if defined?(@pending_link)

      @pending_link = account_link_token.present? ? ExternalAuth::PendingIdentityLink.find(account_link_token) : nil
    end
  end
end
