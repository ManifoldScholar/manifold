# frozen_string_literal: true

module LtiJwksHelper
  # Builds an RSA keypair and its JWKS representation.
  # Returns [rsa_key, jwk, jwks_payload_hash].
  def build_jwks(kid: SecureRandom.uuid)
    rsa_key = OpenSSL::PKey::RSA.generate(2048)
    jwk = JWT::JWK.new(rsa_key, { kid: kid, use: "sig", alg: "RS256" })
    jwks_payload = JWT::JWK::Set.new(jwk).export
    [rsa_key, jwk, jwks_payload.deep_stringify_keys]
  end
end

RSpec.configure do |config|
  config.include LtiJwksHelper
end
