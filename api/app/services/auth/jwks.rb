module Auth
  # Generates a JWKS set for the Manifold private key
  # TODO: Caching
  class Jwks

    def initialize(private_key = Rails.application.config.manifold.private_key)
      @private_key = private_key
    end

    def kid
      @kid ||= Digest::SHA256.hexdigest(@private_key.to_s)
    end

    def jwk
      @jwk ||= JWT::JWK.new(@private_key, jwks_params)
    end

    def jwks_params
      @jwks_params ||= { use: "sig", alg: "RS256", kid: }
    end

    def jwks
      @jwks ||= JWT::JWK::Set.new(jwk).export
    end
    alias as_json jwks
    delegate :to_json, to: :jwks

  end
end
