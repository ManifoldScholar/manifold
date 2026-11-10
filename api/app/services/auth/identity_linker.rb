# frozen_string_literal: true

module Auth
  # Links a new external login to the existing account its email matched
  class IdentityLinker
    ERROR_MESSAGE = "We could not verify that this account is yours"

    def initialize(omniauth_hash = nil, params = nil)
      @omniauth_hash = omniauth_hash
      @params = params
    end

    # Save the login and return the client-login URL to send the user to.
    def divert_url(matched_user)
      token = ExternalAuth::PendingIdentityLink.build(omniauth_hash, matched_user).persist!
      OmniauthRedirect.new(omniauth_hash, params, account_link_token: token).redirect_url
    end

    # Attach the pending identity and resolve where the login lands. Returns self.
    def finalize(account_link_token, user)
      outcome = ExternalAuth::FinalizeIdentityLink.new(account_link_token, user).call
      if outcome.success?
        @linked = outcome.value!
        @resolver = resolver_for(@linked)
      end
      self
    end

    def success?
      @resolver ? @resolver.failure.nil? : false
    end

    def user
      @linked&.fetch(:user)
    end

    def redirect_url
      success? ? @resolver.redirect_url : error_url
    end

    def redirect_query
      @resolver.redirect_query if success?
    end

    def meta
      @resolver.meta if success?
    end

    def error
      ERROR_MESSAGE
    end

    private

    attr_reader :omniauth_hash, :params

    def resolver_for(linked)
      ExternalAuth::Resolver.new(linked[:auth_hash], linked[:user], { provider: linked[:auth_hash]["provider"] })
    end

    def error_url
      OmniauthRedirect.new(omniauth_hash, params, account_link_error: ERROR_MESSAGE).redirect_url
    end
  end
end
