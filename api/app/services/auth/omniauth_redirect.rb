# frozen_string_literal: true

module Auth
  # Determines where an omniauth login redirects and the query params that ride along.
  class OmniauthRedirect
    POST_AUTH_REDIRECT_PATH = "/oauth"
    DEEP_LINKING_PATH = "/lti/deep_linking"
    LINK_PATH = "/login"

    attr_reader :omniauth, :params, :error, :deep_linking_context, :account_link_token, :account_link_error

    def initialize(omniauth, params, error: nil, deep_linking_context: nil, account_link_token: nil, account_link_error: nil)
      @omniauth = omniauth
      @params = params
      @error = error
      @deep_linking_context = deep_linking_context
      @account_link_token = account_link_token
      @account_link_error = account_link_error
    end

    # @return [URI]
    def redirect_uri
      return link_redirect_uri if account_link_token || account_link_error
      return deep_linking_redirect_uri if deep_linking_context

      post_authorize_redirect_uri(error ? error_query_string : target_query_string)
    end

    # The login redirect for an external login whose email matched an existing account, so the user can
    # confirm the account is theirs before the identity is linked.
    # @return [URI]
    def link_redirect_uri
      query = { account_link: account_link_email, account_link_token: account_link_token, account_link_error: account_link_error }.compact

      URI.parse(Rails.configuration.manifold.url).tap do |uri|
        uri.path = LINK_PATH
        uri.query = build_query_string(**query)
      end
    end

    # Funnels the deep linking launch through /oauth so the client completes the JWT exchange before the
    # picker, with the picker path riding along as redirect_path (see {#target_path}).
    # @return [URI]
    def deep_linking_redirect_uri
      post_authorize_redirect_uri(build_query_string(redirect_path: deep_linking_picker_path))
    end

    # The picker exchanges this token for its selection constraints at GET /api/v1/lti/deep_linking.
    # @return [String]
    def deep_linking_picker_path
      "#{DEEP_LINKING_PATH}?#{build_query_string(lti_context: deep_linking_context[:token])}"
    end

    # @return [String]
    def error_query_string
      build_query_string(error:)
    end

    # @return [String]
    def redirect_url
      redirect_uri.to_s
    end

    # @return [URI]
    def post_authorize_redirect_uri(query = target_query_string)
      URI.parse(Rails.configuration.manifold.url).tap do |uri|
        uri.path = POST_AUTH_REDIRECT_PATH
        uri.query = query
      end
    end

    # LTI carries the target resource in `target_link_uri`; SAML in `RelayState`.
    # @return [String]
    def target_query_string
      build_query_string(**(lti_redirect_resource || target_path || target_resource || {}))
    end

    # Deep-linked content items carry their resource identity in the target_link_uri query, letting the
    # client build the destination URL (see {Lti::ResourceReference#launch_url}).
    # @return [Hash, nil]
    def lti_redirect_resource
      return unless lti?

      params = Rack::Utils.parse_nested_query(URI.parse(target_link_uri.to_s).query.to_s)
      return if params["redirect_type"].blank? || params["redirect_id"].blank?

      { redirect_type: params["redirect_type"], redirect_id: params["redirect_id"] }
    rescue URI::InvalidURIError
      nil
    end

    # @return [URI]
    def target_link_uri
      omniauth.dig("extra", "target_link_uri")
    end

    # @return [Hash, nil]
    def target_resource
      return if relay_state.blank?

      resource = ExternalIdentifier.fetch(relay_state)&.identifiable
      return if resource.blank?

      parent = get_parent_for(resource)

      {
        redirect_type: resource.class.name,
        redirect_id: resource.try(:slug) || resource.id,
        parent: parent&.try(:slug) || parent&.id
      }.compact
    end

    # Gets the closest parent of a passed object that can be redirected to
    # @param resource [Resource, ResourceCollection, TextSection]
    # @return [Project, Text]
    def get_parent_for(resource)
      case resource
      when Resource, ResourceCollection
        resource.project
      when TextSection
        resource.text
      end
    end

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

    def build_query_string(**args)
      Rack::Utils.build_nested_query(args)
    end

    def relay_state
      @relay_state ||= params[:RelayState] || params[:relay_state]
    end

    def account_link_email
      omniauth.dig("info", "email")
    end

    def lti?
      params[:provider] == "lti"
    end
  end
end
