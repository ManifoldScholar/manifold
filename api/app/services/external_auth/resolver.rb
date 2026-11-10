# frozen_string_literal: true

module ExternalAuth
  # Processes an OmniAuth login, resolves any necessary identity linking issues, and exposes methods to
  # generate a response appropriate to the request (i.e. a redirect or JSON response).
  class Resolver
    def initialize(auth_hash, user, params)
      @auth_hash = auth_hash
      @user = user
      @params = params
    end

    def redirect_url
      Auth::OmniauthRedirect.new(auth_hash, params, deep_linking_context: deep_linking_context).redirect_url
    end

    # The post-auth redirect query string, which the client parses exactly as it does the /oauth query.
    # @return [String, nil]
    def redirect_query
      URI.parse(redirect_url).query
    end

    def meta
      return {} if deep_linking_token.blank?

      { linkRedirectPath: "#{Auth::OmniauthRedirect::DEEP_LINKING_PATH}?#{{ lti_context: deep_linking_token }.to_query}" }
    end

    def failure
      post_auth[:failure]
    end

    private

    attr_reader :auth_hash, :user, :params

    def deep_linking_context
      deep_linking_token ? { token: deep_linking_token } : nil
    end

    def deep_linking_token
      post_auth[:token]
    end

    def post_auth
      @post_auth ||= run_effects
    end

    def run_effects
      return { token: nil, failure: nil } unless lti?
      return persist_deep_linking if deep_linking_request?

      Lti::ResourceLink::Enroll.new(auth_hash, user).call
      { token: nil, failure: nil }
    end

    def persist_deep_linking
      result = Lti::DeepLinking::HandleRequest.new(auth_hash, user).call
      return { token: result.value!.fetch(:token), failure: nil } if result.success?

      { token: nil, failure: result.failure }
    end

    def lti?
      auth_hash["provider"] == "lti"
    end

    def deep_linking_request?
      Lti::Launch.new(auth_hash).message_type == ::Lti::Registration::Registrar::DL_MESSAGE_TYPE
    end
  end
end
