# frozen_string_literal: true

module OmniAuth
  module Strategies
    class Lti
      include OmniAuth::Strategy

      option :name, "lti"

      # The core LTI namespace and the Deep Linking (`lti-dl`) namespace are flattened into extra.lti by their short key
      LTI_CLAIM_PREFIXES = %w[
        https://purl.imsglobal.org/spec/lti/claim/
        https://purl.imsglobal.org/spec/lti-dl/claim/
      ].freeze

      # Find the registration, generate nonce/state, and redirect to the LTI provider
      def request_phase
        return fail!(:lti_disabled, OmniAuth::Error.new("LTI is not enabled")) unless lti_enabled?

        registration = find_registration!(request.params["iss"], request.params["client_id"])

        nonce = SecureRandom.uuid
        state = sign_state(nonce: nonce, target_link_uri: request.params["target_link_uri"])

        redirect authorization_uri(registration, nonce, state)
      end

      # Validate the JWT, then build the OmniAuth auth hash
      def callback_phase
        return fail!(:lti_disabled, OmniAuth::Error.new("LTI is not enabled")) unless lti_enabled?

        id_token = request.params["id_token"]
        return fail!(:missing_id_token, OmniAuth::Error.new("No id_token in callback")) unless id_token

        state = verify_state!(request.params["state"])
        @claims = decode_and_verify!(id_token, state)
        @target_link_uri = state["target_link_uri"]

        env["omniauth.auth"] = auth_hash
        call_app!
      rescue JWT::DecodeError, OmniAuth::Error => e
        Rails.logger.warn("LTI JWT verification failed: #{e.class} — #{e.message}")
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

      # @raise [OmniAuth::Error]
      def find_registration!(issuer, client_id)
        LtiRegistration.find_by(issuer: issuer, client_id: client_id).tap do |registration|
          raise OmniAuth::Error, "No LTI registration found for issuer #{issuer} and client_id #{client_id}" unless registration.present?
          raise OmniAuth::Error, "LTI registration for issuer #{issuer} and client_id #{client_id} is not approved" unless registration.approved?
        end
      end

      # Find or create a deployment for this registration, and ensure it's enabled.
      # @raise [OmniAuth::Error]
      # @return [LtiDeployment]
      def verify_deployment!(registration, claims)
        deployment_id = claims["https://purl.imsglobal.org/spec/lti/claim/deployment_id"]
        raise OmniAuth::Error, "Missing deployment_id claim" unless deployment_id

        find_or_create_deployment!(registration, deployment_id).tap do |deployment|
          raise OmniAuth::Error, "Deployment #{deployment_id} is disabled" unless deployment.enabled?
        end
      end

      # @return [LtiDeployment]
      def find_or_create_deployment!(registration, deployment_id)
        registration.lti_deployments.find_or_create_by!(deployment_id: deployment_id)
      rescue ActiveRecord::RecordNotUnique
        registration.lti_deployments.find_by!(deployment_id: deployment_id)
      end

      # Builds the authorization redirect URI with all required OIDC parameters.
      # @param registration [LtiRegistration]
      # @param nonce [String]
      # @param state [String]
      # @return [String]
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

      # Decodes and verifies the JWT id_token
      def decode_and_verify!(id_token, state)
        unverified = JWT.decode(id_token, nil, false).first
        registration = find_registration!(unverified["iss"], unverified["aud"])
        jwks_loader = ::Lti::Auth::PlatformJwks.new(registration)

        JWT.decode(
          id_token,
          nil,
          true,
          algorithms: ["RS256"],
          jwks: jwks_loader.to_proc,
          verify_iss: true,
          iss: registration.issuer,
          verify_aud: true,
          aud: registration.client_id
        ).first.tap do |claims|
          verify_nonce!(claims, state)
          verify_timing!(claims)
          verify_deployment!(registration, claims)
        end
      end

      # @raise [OmniAuth::Error]
      def verify_nonce!(claims, state)
        raise OmniAuth::Error, "Nonce mismatch" unless claims["nonce"] == state["nonce"]
      end

      def sign_state(payload)
        message_verifier.generate(payload, purpose: :lti_state)
      end

      # @raise [OmniAuth::Error]
      def verify_state!(state)
        raise OmniAuth::Error, "Missing state parameter" unless state.present?

        message_verifier.verify(state, purpose: :lti_state)
      rescue ActiveSupport::MessageVerifier::InvalidSignature
        raise OmniAuth::Error, "Invalid or tampered state parameter"
      end

      def message_verifier
        ActiveSupport::MessageVerifier.new(Rails.application.secret_key_base, digest: "SHA256")
      end

      # @raise [OmniAuth::Error]
      def verify_timing!(claims)
        now = Time.now.to_i
        raise OmniAuth::Error, "Token is not yet valid (iat)" if claims["iat"] && claims["iat"] > now + 5
        raise OmniAuth::Error, "Token has expired" if claims["exp"] && claims["exp"] < now - 5
      end

      def extract_lti_claims(claims)
        claims.each_with_object({}) do |(key, value), memo|
          prefix = LTI_CLAIM_PREFIXES.find { |candidate| key.start_with?(candidate) }
          next unless prefix

          memo[key.delete_prefix(prefix)] = value
        end
      end

      def lti_enabled?
        Settings.current.lti.enabled?
      end
    end
  end
end
