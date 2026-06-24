# frozen_string_literal: true

require "rails_helper"

RSpec.describe "POST /api/v1/lti/deep_linking", type: :request do
  let(:context_token) { SecureRandom.hex(32) }
  let(:cache_key) { "#{Lti::DeepLinking::Context::CACHE_KEY_PREFIX}/#{context_token}" }
  let(:other_instructor) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project) }
  let(:course_context) { FactoryBot.create(:lti_course_context) }

  let(:cached_payload) do
    {
      "user_id"               => reader.id,
      "client_id"             => "tool-client-id",
      "accept_types"          => ["ltiResourceLink"],
      "accept_multiple"       => true,
      "deep_link_return_url"  => "https://canvas.example.com/dl_return",
      "data"                  => "opaque",
      "deployment_id"         => "d1",
      "iss"                   => "https://canvas.example.com",
      "lti_course_context_id" => course_context.id
    }
  end

  let(:valid_selection) { [{ type: "Project", id: project.id, title: "Intro" }] }

  let(:valid_params) do
    { context_token: context_token, selection: valid_selection }.to_json
  end

  before do
    Rails.cache.clear
  end

  # Example 1: unauthenticated request → 401 from authenticate_request!
  describe "unauthenticated request" do
    it "returns 401 with an errors array" do
      post api_v1_lti_deep_linking_path,
           headers: { "content-type" => "application/json" },
           params: valid_params

      expect(response).to have_http_status(:unauthorized)
      body = response.parsed_body
      expect(body["errors"]).to be_an(Array)
    end
  end

  # Examples 2–9 authenticate as reader via the shared context.
  describe "authenticated requests" do
    before do
      Rails.cache.write(cache_key, cached_payload, expires_in: 1.hour)
    end

    # Example 2: valid token + valid selection → 202 with empty body + cache consumed
    context "when the token is valid and the selection is well-formed" do
      it "returns 200 with the deep_link_return_url and a signed JWT" do
        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: valid_params

        expect(response).to have_http_status(:ok)
        body = response.parsed_body
        expect(body["deep_link_return_url"]).to eq("https://canvas.example.com/dl_return")
        expect(body["jwt"]).to be_present
      end

      it "consumes the cache key (single-use token)" do
        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: valid_params

        expect(Rails.cache.read(cache_key)).to be_nil
      end
    end

    # Example 3: token not in cache → 401 expired
    context "when the cache key does not exist" do
      before do
        Rails.cache.delete(cache_key)
      end

      it "returns 401 when the token is expired" do
        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: valid_params

        expect(response).to have_http_status(:unauthorized)
        body = response.parsed_body
        expect(body["errors"].first["title"]).to eq("Context Expired")
        expect(body["errors"].first["status"]).to eq("401")
      end
    end

    # Example 4: double-submit locks out the token on the second call
    context "when the same token is submitted twice" do
      it "returns 200 on first submission and 401 expired on second" do
        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: valid_params

        expect(response).to have_http_status(:ok)

        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: valid_params

        expect(response).to have_http_status(:unauthorized)
        body = response.parsed_body
        expect(body["errors"].first["title"]).to eq("Context Expired")
      end
    end

    # Example 5: wrong instructor → 403 unauthorized, token NOT consumed
    context "when the token belongs to a different instructor" do
      let(:other_payload) do
        cached_payload.merge("user_id" => other_instructor.id)
      end

      before do
        Rails.cache.write(cache_key, other_payload, expires_in: 1.hour)
      end

      it "returns 403 when a different instructor owns the session" do
        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: valid_params

        expect(response).to have_http_status(:forbidden)
        body = response.parsed_body
        expect(body["errors"].first["title"]).to eq("Unauthorized")
        expect(body["errors"].first["status"]).to eq("403")
      end

      it "does not consume the cache key on a forbidden result" do
        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: valid_params

        expect(Rails.cache.read(cache_key)).to eq(other_payload)
      end
    end

    # Example 6: missing context_token → 401 expired
    # A blank context_token always produces a cache miss (step 1 fires before shape validation).
    # The service computes "lti/dl/" (empty-suffix key) which is not in the cache; the outer
    # before block only writes to "lti/dl/#{context_token}" (the real token key).
    # Per 03-02 deviation: missing context_token yields :unauthorized / "Context Expired", not 422.
    context "when context_token is missing" do
      let(:no_token_params) { { selection: valid_selection }.to_json }

      it "returns 401 expired (blank token cannot resolve a cache entry)" do
        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: no_token_params

        expect(response).to have_http_status(:unauthorized)
        body = response.parsed_body
        expect(body["errors"].first["title"]).to eq("Context Expired")
      end
    end

    # Example 7: malformed selection (item missing required keys) → 422 per-field
    context "when a selection item is missing required keys" do
      let(:bad_selection_params) do
        { context_token: context_token, selection: [{ title: "x" }] }.to_json
      end

      it "returns 422 with per-field errors for the missing type and id" do
        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: bad_selection_params

        expect(response).to have_http_status(:unprocessable_entity)
        body = response.parsed_body
        pointers = body["errors"].map { |e| e.dig("source", "pointer") }
        expect(pointers).to include("/data/attributes/selection/0/type", "/data/attributes/selection/0/id")
      end
    end

    # Example 8: accept_types mismatch → 400 single message
    context "when the session does not accept resource links" do
      before do
        Rails.cache.write(cache_key, cached_payload.merge("accept_types" => ["file"]), expires_in: 1.hour)
      end

      it "returns 400 as an invalid selection" do
        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: valid_params

        expect(response).to have_http_status(:bad_request)
        body = response.parsed_body
        expect(body["errors"].length).to eq(1)
        expect(body["errors"].first["title"]).to eq("Invalid Selection")
        expect(body["errors"].first["status"]).to eq("400")
      end
    end

    # Example 9: accept_multiple: false with multiple items → 400 single message
    context "when accept_multiple is false and multiple items are submitted" do
      let(:single_only_payload) { cached_payload.merge("accept_multiple" => false) }
      let(:multi_select_params) do
        {
          context_token: context_token,
          selection: [
            { type: "Project", id: project.id, title: "A" },
            { type: "Project", id: FactoryBot.create(:project).id, title: "B" }
          ]
        }.to_json
      end

      before do
        Rails.cache.write(cache_key, single_only_payload, expires_in: 1.hour)
      end

      it "returns 400 with a single error" do
        post api_v1_lti_deep_linking_path,
             headers: reader_headers,
             params: multi_select_params

        expect(response).to have_http_status(:bad_request)
        body = response.parsed_body
        expect(body["errors"].length).to eq(1)
        expect(body["errors"].first["status"]).to eq("400")
      end
    end
  end
end
