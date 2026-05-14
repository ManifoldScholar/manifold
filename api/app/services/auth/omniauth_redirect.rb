module Auth
  # Determines the query parameters that should be sent along with an Omniauth redirect
  # All redirects go to POST_AUTH_REDIRECT_PATH with a token stored in a cookie, but the
  # redirect param(s) can vary based on context.
  class OmniauthRedirect

    POST_AUTH_REDIRECT_PATH = "/oauth"
    DEEP_LINKING_PATH = "/lti/deep_linking"

    attr_reader :omniauth, :params, :error, :deep_linking_context

    def initialize(omniauth, params, error: nil, deep_linking_context: nil)
      @omniauth = omniauth
      @params = params
      @error = error
      @deep_linking_context = deep_linking_context
    end

    # Builds a redirect URI based on context
    # @return [URI]
    def redirect_uri
      query = if error
        error_query_string
      elsif deep_linking_context
        deep_linking_query_string
      else
        target_query_string
      end

      post_authorize_redirect_uri(query)
    end

    # Builds a redirect to the
    def deep_linking_query_string
      nested_query = build_query_string(lti_token: deep_linking_context.token)
      { redirect_path: "#{DEEP_LINKING_PATH}?#{nested_query}" }
    end

    def error_query_string
      build_query_string(error:)
    end

    # @return [String]
    def redirect_url
      redirect_uri.to_s
    end

    def post_authorize_redirect_uri(query = target_query_string)
      URI.parse(Rails.configuration.manifold.url).tap do |uri|
        uri.path = POST_AUTH_REDIRECT_PATH
        uri.query = query
      end
    end

    # Generate a query string for the client to redirect the user to the requested resource
    # LTI provides a `target_link_uri`, a full URL to the requested resource
    # SAML can provide a `RelayState`
    def target_query_string
      build_query_string(**(target_path || target_resource || {}))
    end

    # Parse relay_state for an external identifier
    # @return [Hash, nil]
    def target_resource
      return if relay_state.blank?

      resource = ExternalIdentifier.fetch(relay_state)&.identifiable
      return if resource.blank?

      {
        redirect_type: resource.class.name,
        redirect_id: resource.try(:slug) || resource.id
      }
    end

    # Parse LTI target_link_uri or relay_state for a redirect URI
    # @return [String, nil]
    def target_path
      [omniauth_hash.dig("extra", "target_link_uri"), relay_state].compact.find do |value|
        URI.regexp.match? value
      end.then do |url_string|
        return if url_string.blank?

        uri = URI.parse(url_string)
        return unless uri.host == Rails.application.config.manifold.domain.gsub(/:\d+/, "")

        { redirect_path: "#{uri.path}?#{uri.query}".delete_suffix("?") }
      end
    rescue URI::BadURIError, URI::InvalidURIError
      nil
    end

    # @param args [Hash] the query params
    # @return [String, nil]
    def build_query_string(**args)
      Rack::Utils.build_nested_query(args)
    end

    def relay_state
      @relay_state ||= params[:RelayState] || params[:relay_state]
    end

    def lti?
      params[:provider] == "lti"
    end
  end
end
