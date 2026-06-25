# frozen_string_literal: true

require "rails_helper"

RSpec.describe "GET /api/v1/lti/deep_linking", type: :request do
  let(:context_token) { SecureRandom.hex(32) }
  let(:cache_key) { "#{Lti::DeepLinking::Context::CACHE_KEY_PREFIX}/#{context_token}" }

  let(:cached_payload) do
    {
      "user_id"              => reader.id,
      "accept_types"         => ["ltiResourceLink"],
      "accept_multiple"      => true,
      "deep_link_return_url" => "https://canvas.example.com/dl_return",
      "data"                 => "opaque",
      "iss"                  => "https://canvas.example.com",
      "client_id"            => "tool-client-id"
    }
  end

  before do
    Rails.cache.clear
  end

  describe "unauthenticated request" do
    it "returns 401" do
      get api_v1_lti_deep_linking_path(context_token: context_token)
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "authenticated requests" do
    before { Rails.cache.write(cache_key, cached_payload, expires_in: 1.hour) }

    it "returns the picker constraints without consuming the token" do
      get api_v1_lti_deep_linking_path(context_token: context_token), headers: reader_headers

      expect(response).to have_http_status(:ok)
      body = response.parsed_body
      expect(body["accept_types"]).to eq(["ltiResourceLink"])
      expect(body["accept_multiple"]).to be(true)
      expect(body).not_to have_key("deep_link_return_url")
      expect(Rails.cache.read(cache_key)).to be_present
    end

    it "returns 401 'expired' for an unknown token" do
      get api_v1_lti_deep_linking_path(context_token: "missing"), headers: reader_headers

      expect(response).to have_http_status(:unauthorized)
      expect(response.parsed_body["errors"].first["title"]).to eq("Context Expired")
    end

    it "returns 403 when a different instructor reads the session" do
      get api_v1_lti_deep_linking_path(context_token: context_token), headers: another_reader_headers

      expect(response).to have_http_status(:forbidden)
      expect(response.parsed_body["errors"].first["title"]).to eq("Unauthorized")
    end
  end
end
