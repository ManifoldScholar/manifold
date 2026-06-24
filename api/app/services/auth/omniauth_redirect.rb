# frozen_string_literal: true

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
      return deep_linking_redirect_uri if deep_linking_context

      post_authorize_redirect_uri(error ? error_query_string : target_query_string)
    end

    # Sends a successful deep linking launch through /oauth so the client can
    # complete the JWT exchange before landing on the picker. The picker path
    # (carrying the opaque context token) rides along as redirect_path, the same
    # mechanism a normal resource-link launch uses via {#target_path}.
    # @return [URI]
    def deep_linking_redirect_uri
      post_authorize_redirect_uri(build_query_string(redirect_path: deep_linking_picker_path))
    end

    # The path the client forwards to after /oauth completes the JWT exchange.
    # Carries only the opaque context token; the picker fetches its selection
    # constraints by exchanging the token at GET /api/v1/lti/deep_linking.
    def deep_linking_picker_path
      "#{DEEP_LINKING_PATH}?#{build_query_string(lti_context: deep_linking_context[:token])}"
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
      build_query_string(**(lti_redirect_resource || target_path || target_resource || {}))
    end

    # Parse redirect_type / redirect_id from an LTI launch's target_link_uri
    # query. Deep-linked content items carry the resource identity there, letting
    # the client build the destination URL (see {Lti::ResourceReference#launch_url}).
    # @return [Hash, nil]
    def lti_redirect_resource
      return unless lti?

      params = Rack::Utils.parse_nested_query(URI.parse(target_link_uri.to_s).query.to_s)
      return if params["redirect_type"].blank? || params["redirect_id"].blank?

      { redirect_type: params["redirect_type"], redirect_id: params["redirect_id"] }
    rescue URI::InvalidURIError
      nil
    end

    def target_link_uri
      omniauth.dig("extra", "target_link_uri")
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
      url_string = [omniauth.dig("extra", "target_link_uri"), relay_state].compact.find do |value|
        URI::RFC2396_PARSER.make_regexp.match? value
      end
      return if url_string.blank?

      uri = URI.parse(url_string)
      return unless uri.host == Rails.application.config.manifold.domain.gsub(/:\d+/, "")

      { redirect_path: "#{uri.path}?#{uri.query}".delete_suffix("?") }
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
