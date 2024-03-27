module ManifoldEnv
  # rubocop:disable Metrics/ParameterLists
  # rubocop:disable Metrics/MethodLength
  class CustomOauthProvider
    def initialize(
      name:, client_id:, client_secret:, host:,
      protocol: :https, endpoints: {}, descriptive_name: nil,
      email_key: "email", name_key: "name", nickname_key: "nickname", uid_key: "id"
    )
      @client_id     = client_id
      @client_secret = client_secret
      @name          = name.to_sym
      @host          = host
      @protocol      = protocol.match?(/https/i) ? :https : :http
      @endpoints     = parse_endpoints endpoints
      @descriptive_name = descriptive_name.presence || @name.to_s.titleize
      @email_key = email_key.to_s
      @name_key = name_key.to_s
      @nickname_key = nickname_key.to_s
      @uid_key = uid_key.to_s
    end

    # @!group Attributes

    attr_reader :client_id, :client_secret, :descriptive_name, :email_key, :name_key, :nickname_key, :uid_key

    # @!attribute [r] client_options
    # @return [Hash]
    def client_options
      @client_options ||= build_client_options
    end

    # @!attribute [r] endpoints
    # @param [{ Symbol => ManifoldEnv::CustomOauthEndpoint }]
    attr_reader :endpoints

    # @!attribute [r] host
    # @return [String]
    attr_reader :host

    # @!attribute [r] name
    # @return [Symbol]
    attr_reader :name

    # @!attribute [r] protocol
    # @return [:http, :https]
    attr_reader :protocol

    # @!attribute [r] site
    # @return [String]
    def site
      @site ||= build_url
    end

    def strategy_class
      @strategy_class ||= build_strategy_class
    end

    # @!endgroup

    # @return [String]
    def build_url(**parts)
      uri_klass.build(parts.merge(host: host)).to_s
    end

    # @return [(String, String)]
    def credentials
      [client_id, client_secret]
    end

    def endpoint(key)
      endpoints.fetch key
    rescue KeyError
      raise "Undefined endpoint: #{key}"
    end

    def endpoint_method(key)
      endpoint(key).http_method
    end

    def endpoint_url(key)
      endpoint(key).url
    end

    def https?
      protocol == :https
    end

    private

    def build_client_options
      {}.tap do |h|
        h[:site] = site
        h[:authorize_url] = endpoint_url(:authorize)
        h[:token_url]     = endpoint_url(:token)
        h[:token_method]  = endpoint_method(:token)
      end
    end

    def build_strategy_class
      provider = self

      Class.new(OmniAuth::Strategies::OAuth2) do
        option :name, provider.name

        option :client_options, provider.client_options

        uid { raw_info[provider.uid_key] }

        info do
          {
            email: raw_info[provider.email_key],
            name: raw_info[provider.name_key],
            nickname: raw_info[provider.nickname_key]
          }
        end

        extra do
          {
            "raw_info" => raw_info
          }
        end

        define_method(:authorize_params) do
          super().merge(provider.endpoint(:authorize).query)
        end

        define_method(:raw_info) do
          @raw_info ||=
            begin
              http_method = provider.endpoint_method(:userinfo)
              url = provider.endpoint_url(:userinfo)

              access_token.__send__(http_method, url).parsed
            end
        end

        define_method(:token_params) do
          redirect_uri = full_host + "/auth/#{provider.name}/callback"

          super().merge(provider.endpoint(:token).query).merge(redirect_uri: redirect_uri)
        end
      end.tap do |klass|
        OmniAuth::Strategies.const_set(name.to_s.classify.to_sym, klass)
      end
    end

    # @return [{ Symbol => ManifoldEnv::CustomOauthEndpoint }]
    def parse_endpoints(endpoints)
      parsed = {}.with_indifferent_access

      endpoints.each_with_object(parsed) do |(endpoint_name, endpoint_options), h|
        defaults = { provider: self, name: endpoint_name }

        options = endpoint_options.merge(defaults).symbolize_keys

        h[endpoint_name] = ManifoldEnv::CustomOauthEndpoint.new options
      end
    end

    def uri_klass
      https? ? URI::HTTPS : URI::HTTP
    end
  end
  # rubocop:enable Metrics/ParameterLists
  # rubocop:enable Metrics/MethodLength
end
