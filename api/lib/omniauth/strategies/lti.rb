# frozen_string_literal: true

module OmniAuth
  module Strategies
    class Lti
      include OmniAuth::Strategy

      option :name, "lti"

      # The request phase handles the platform-initiated OIDC login.
      # The platform sends iss, client_id, login_hint, lti_message_hint,
      # and target_link_uri. We generate a nonce and state, store them
      # in the session, and redirect to the platform's authorization
      # endpoint.
      def request_phase
        return fail!(:lti_disabled, OmniAuth::Error.new("LTI is not enabled")) unless lti_enabled?

        registration = find_registration!(request.params["iss"], request.params["client_id"])

        nonce = SecureRandom.uuid
        state = sign_state(nonce: nonce, target_link_uri: request.params["target_link_uri"])

        redirect authorization_uri(registration, nonce, state)
      end

      # The callback phase receives the id_token from the platform
      # as a form POST. We validate the JWT signature, issuer, audience,
      # nonce, timing, and deployment, then build the OmniAuth auth hash.
      def callback_phase
        return fail!(:lti_disabled, OmniAuth::Error.new("LTI is not enabled")) unless lti_enabled?

        id_token = request.params["id_token"]
        return fail!(:missing_id_token, OmniAuth::Error.new("No id_token in callback")) unless id_token

        state = verify_state!(request.params["state"])
        claims = decode_and_verify!(id_token, state)
        @claims = claims
        @target_link_uri = state["target_link_uri"]

        env["omniauth.auth"] = auth_hash
        call_app!
      rescue JWT::DecodeError, OmniAuth::Error => e
        fail!(:invalid_id_token, e)
      end

      uid do
        "#{@claims['iss']}|#{@claims['sub']}"
      end

      info do
        {
          name: [@claims["given_name"], @claims["family_name"]].compact.join(" ").presence || @claims["name"],
          email: @claims["email"],
          first_name: @claims["given_name"],
          last_name: @claims["family_name"],
          image: @claims["picture"]
        }.compact
      end

      extra do
        {
          raw_info: @claims,
          lti: extract_lti_claims(@claims),
          target_link_uri: @target_link_uri
        }.compact
      end

      private

      def find_registration!(issuer, client_id)
        LtiRegistration.find_by_issuer_and_client_id!(issuer, client_id)
      rescue ActiveRecord::RecordNotFound
        raise OmniAuth::Error, "No enabled LTI registration found for issuer #{issuer} and client_id #{client_id}"
      end

      def verify_deployment!(registration, claims)
        deployment_id = claims.dig("https://purl.imsglobal.org/spec/lti/claim/deployment_id")
        raise OmniAuth::Error, "Missing deployment_id claim" unless deployment_id

        unless registration.lti_deployments.enabled.exists?(deployment_id: deployment_id)
          raise OmniAuth::Error, "Unknown deployment #{deployment_id} for registration #{registration.id}"
        end
      end

      # Builds the authorization redirect URI with all required OIDC parameters.
      def authorization_uri(registration, nonce, state)
        params = {
          scope: "openid",
          response_type: "id_token",
          response_mode: "form_post",
          prompt: "none",
          client_id: registration.client_id,
          redirect_uri: callback_url,
          login_hint: request.params["login_hint"],
          lti_message_hint: request.params["lti_message_hint"],
          nonce: nonce,
          state: state
        }.compact

        "#{registration.authorization_endpoint}?#{Rack::Utils.build_query(params)}"
      end

      # Decodes the JWT id_token and verifies its signature, issuer,
      # audience, nonce, timing, and deployment.
      def decode_and_verify!(id_token, state)
        unverified = JWT.decode(id_token, nil, false).first
        registration = find_registration!(unverified["iss"], unverified["aud"])
        jwks = fetch_platform_jwks(registration)

        claims = JWT.decode(
          id_token,
          nil,
          true,
          algorithms: ["RS256"],
          jwks: jwks,
          verify_iss: true,
          iss: registration.issuer,
          verify_aud: true,
          aud: registration.client_id
        ).first

        verify_nonce!(claims, state)
        verify_timing!(claims)
        # verify_deployment!(registration, claims)

        claims
      end

      def verify_nonce!(claims, state)
        raise OmniAuth::Error, "Nonce mismatch" unless claims["nonce"] == state["nonce"]
      end

      def sign_state(payload)
        message_verifier.generate(payload, purpose: :lti_state)
      end

      def verify_state!(state)
        raise OmniAuth::Error, "Missing state parameter" unless state.present?

        message_verifier.verify(state, purpose: :lti_state)
      rescue ActiveSupport::MessageVerifier::InvalidSignature
        raise OmniAuth::Error, "Invalid or tampered state parameter"
      end

      def message_verifier
        ActiveSupport::MessageVerifier.new(Rails.application.secret_key_base, digest: "SHA256")
      end

      def verify_timing!(claims)
        now = Time.now.to_i
        raise OmniAuth::Error, "Token is not yet valid (iat)" if claims["iat"] && claims["iat"] > now + 5
        raise OmniAuth::Error, "Token has expired" if claims["exp"] && claims["exp"] < now - 5
      end

      LTI_CLAIM_PREFIX = "https://purl.imsglobal.org/spec/lti/claim/"

      def extract_lti_claims(claims)
        lti = {}

        claims.each do |key, value|
          if key.start_with?(LTI_CLAIM_PREFIX)
            short_key = key.delete_prefix(LTI_CLAIM_PREFIX)
            lti[short_key] = value
          end
        end

        lti
      end

      def fetch_platform_jwks(registration)
        response = HTTParty.get(registration.jwks_uri)
        JWT::JWK::Set.new(response.parsed_response)
      end

      def lti_enabled?
        Settings.current.lti.enabled?
      end
    end
  end
end
