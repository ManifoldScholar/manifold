# frozen_string_literal: true

require "rails_helper"

RSpec.describe "LTI Deep Linking callback", type: :request do
  include_context "omniauth request"

  let!(:registration) do
    FactoryBot.create(:lti_registration,
                      issuer: "https://canvas.example.com",
                      client_id: "tool-client-id")
  end
  let!(:deployment) do
    FactoryBot.create(:lti_deployment,
                      lti_registration: registration,
                      deployment_id: "deploy-1")
  end
  let(:user) { FactoryBot.create(:user) }
  let!(:identity) { FactoryBot.create(:identity, user: user, provider: "lti", uid: "https://canvas.example.com|user-1") }

  let(:dl_settings) do
    {
      "deep_link_return_url" => "https://canvas.example.com/dl_return",
      "accept_types"         => ["ltiResourceLink"],
      "accept_multiple"      => true,
      "data"                 => "opaque-platform-data"
    }
  end

  let(:lti_extra) do
    {
      "message_type"          => "LtiDeepLinkingRequest",
      "deployment_id"         => deployment.deployment_id,
      "context"               => {
        "id"    => "course-ctx-42",
        "title" => "Intro to Ruby",
        "label" => "CS101",
        "type"  => ["http://purl.imsglobal.org/vocab/lis/v2/course#CourseSection"]
      },
      "deep_linking_settings" => dl_settings
    }
  end

  let(:raw_info) do
    {
      "iss"   => registration.issuer,
      "aud"   => registration.client_id,
      "sub"   => "user-1",
      "email" => user.email,
      "nonce" => "abc",
      "iat"   => Time.now.to_i,
      "exp"   => Time.now.to_i + 300
    }
  end

  # Build the OmniAuth::AuthHash that the controller reads from request.env["omniauth.auth"].
  # Overridable in nested contexts: call prime_auth_hash(extra_lti_overrides) to rebuild
  # with different lti_extra values before the request.
  let(:auth_hash) do
    OmniAuth::AuthHash.new(
      "provider" => "lti",
      "uid"      => "https://canvas.example.com|user-1",
      "info"     => { "email" => user.email },
      "extra"    => {
        "raw_info"        => raw_info,
        "lti"             => lti_extra,
        "target_link_uri" => Rails.configuration.manifold.url
      }
    )
  end

  let(:manifold_url) { Rails.configuration.manifold.url }

  def prime_auth_hash(hash)
    OmniAuth.config.mock_auth[:lti] = hash
    Rails.application.env_config["omniauth.auth"] = hash
  end

  before do
    Rails.cache.clear
    prime_auth_hash(auth_hash)
  end

  after do
    OmniAuth.config.mock_auth[:lti] = nil
    Rails.application.env_config["omniauth.auth"] = nil
  end

  # Extracts the picker query params nested inside /oauth?redirect_path=...
  def picker_query_params
    redirect_path = Rack::Utils.parse_nested_query(URI.parse(response.location).query)["redirect_path"]
    Rack::Utils.parse_nested_query(URI.parse(redirect_path).query)
  end

  describe "successful LtiDeepLinkingRequest" do
    it "redirects through /oauth carrying the picker path as redirect_path" do
      post "/auth/lti/callback"

      expect(response).to have_http_status(:redirect)
      expect(response.location).to start_with("#{manifold_url}/oauth?")
      redirect_path = Rack::Utils.parse_nested_query(URI.parse(response.location).query)["redirect_path"]
      expect(redirect_path).to start_with("/lti/deep_linking?")
    end

    it "carries only the opaque lti_context token to the picker, no constraints" do
      post "/auth/lti/callback"

      parsed = picker_query_params

      # lti_context is the stable contract anchor from Phase 2
      expect(parsed["lti_context"]).to match(/\A[0-9a-f]{64}\z/)

      # Selection constraints are no longer leaked into the URL; the picker
      # exchanges the token at GET /api/v1/lti/deep_linking instead.
      expect(parsed).not_to have_key("accept_types")
      expect(parsed).not_to have_key("accept_multiple")
      expect(parsed).not_to have_key("deep_link_return_url")
    end

    it "writes a DL context payload to Rails.cache that the picker can read back" do
      post "/auth/lti/callback"

      token = picker_query_params["lti_context"]
      expect(token).to match(/\A[0-9a-f]{64}\z/)

      cached = Rails.cache.read("lti/dl/#{token}")
      expect(cached).to include(
        "data"                 => "opaque-platform-data",
        "deep_link_return_url" => "https://canvas.example.com/dl_return",
        "accept_types"         => ["ltiResourceLink"],
        "accept_multiple"      => true,
        "deployment_id"        => deployment.deployment_id,
        "iss"                  => registration.issuer,
        "user_id"              => user.id
      )
      expect(cached["lti_course_context_id"]).to be_present
    end

    it "does NOT set X-Frame-Options: DENY on the redirect response (iframe-safe)" do
      post "/auth/lti/callback"

      expect(response.headers["X-Frame-Options"]).not_to eq("DENY")
    end

    it "issues the auth code cookie so the React client can complete JWT exchange" do
      https! # the auth code cookie is SameSite=None; Secure, so it is only set over TLS
      post "/auth/lti/callback"

      expect(response.cookies).to have_key(ManagesOauthCookie::OAUTH_COOKIE_NAME)
    end
  end

  describe "InvalidRequestError when deep_link_return_url is missing" do
    before do
      missing_return_url_extra = lti_extra.merge(
        "deep_linking_settings" => dl_settings.except("deep_link_return_url")
      )
      prime_auth_hash(
        OmniAuth::AuthHash.new(auth_hash.to_h.merge("extra" => auth_hash["extra"].to_h.merge("lti" => missing_return_url_extra)))
      )
    end

    it "renders the DL error template with status 400 and the categorized message" do
      post "/auth/lti/callback"

      expect(response).to have_http_status(:bad_request)
      expect(response.body).to include("Deep Linking Error")
      expect(response.body).to include("Invalid request")
      expect(response.body).not_to include("deep_link_return_url")
    end

    it "writes nothing to Rails.cache" do
      expect(Rails.cache).not_to receive(:write).with(%r{\Alti/dl/}, anything, anything)
      post "/auth/lti/callback"
    end

    it "logs the failure at warn level with structured fields" do
      allow(Rails.logger).to receive(:warn)
      post "/auth/lti/callback"
      expect(Rails.logger).to have_received(:warn).with(
        a_string_including(
          "LTI deep linking validation failed:",
          "deployment_id=\"deploy-1\"",
          "message_type=\"LtiDeepLinkingRequest\"",
          "failure_reason=InvalidRequestError"
        )
      )
    end
  end

  describe "unexpected StandardError raised by the deep linking service" do
    before do
      allow(Lti::DeepLinking::Context).to receive(:new)
        .and_raise(StandardError, "Rails.cache connection refused")
    end

    it "renders the generic error message with status 500" do
      post "/auth/lti/callback"

      expect(response).to have_http_status(:internal_server_error)
      expect(response.body).to include("Session expired or unrecognized")
    end

    it "logs the failure at error level with the exception class and deployment context" do
      allow(Rails.logger).to receive(:error)
      post "/auth/lti/callback"
      expect(Rails.logger).to have_received(:error).with(
        a_string_including(
          "LTI deep linking failed:",
          "failure_reason=StandardError",
          "deployment_id=\"deploy-1\""
        )
      )
    end
  end
end
