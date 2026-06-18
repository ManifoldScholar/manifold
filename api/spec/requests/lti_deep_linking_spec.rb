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

  describe "successful LtiDeepLinkingRequest" do
    it "redirects to the picker on the React client with an lti_context token" do
      post "/auth/lti/callback"

      expect(response).to have_http_status(:redirect)
      expect(response.location).to start_with("#{manifold_url}/lti/deep_linking?")
      parsed = Rack::Utils.parse_nested_query(URI.parse(response.location).query)
      expect(parsed["lti_context"]).to match(/\A[0-9a-f]{64}\z/)
    end

    it "includes accept_types, accept_multiple, and deep_link_return_url in the redirect query string" do
      post "/auth/lti/callback"

      parsed = Rack::Utils.parse_nested_query(URI.parse(response.location).query)

      # lti_context is the stable contract anchor from Phase 2
      expect(parsed["lti_context"]).to match(/\A[0-9a-f]{64}\z/)

      # accept_types serializes as bracket notation (accept_types[]=...) per Rails convention,
      # parsed back to an array by parse_nested_query
      expect(parsed["accept_types"]).to eq(["ltiResourceLink"])

      # accept_multiple is a boolean in Ruby but build_nested_query coerces it to a string on the wire;
      # the picker must treat "true"/"false" as the wire representation
      expect(parsed["accept_multiple"]).to eq("true")

      expect(parsed["deep_link_return_url"]).to eq("https://canvas.example.com/dl_return")
    end

    it "writes a DL context payload to Rails.cache that the picker can read back" do
      post "/auth/lti/callback"

      token = Rack::Utils.parse_nested_query(URI.parse(response.location).query)["lti_context"]
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

  describe "DeploymentNotRegisteredError when deployment_id does not match a deployment" do
    before do
      unregistered_extra = lti_extra.merge("deployment_id" => "deploy-not-registered")
      prime_auth_hash(
        OmniAuth::AuthHash.new(auth_hash.to_h.merge("extra" => auth_hash["extra"].to_h.merge("lti" => unregistered_extra)))
      )
    end

    it "renders the DL error template with status 400 and the categorized message" do
      post "/auth/lti/callback"

      expect(response).to have_http_status(:bad_request)
      expect(response.body).to include("Deep Linking Error")
      expect(response.body).to include("Deployment not registered")
    end

    it "logs at warn level with deployment_id reflecting the unregistered value" do
      allow(Rails.logger).to receive(:warn)
      post "/auth/lti/callback"
      expect(Rails.logger).to have_received(:warn).with(
        a_string_including(
          "deployment_id=\"deploy-not-registered\"",
          "failure_reason=DeploymentNotRegisteredError"
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
