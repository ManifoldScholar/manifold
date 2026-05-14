# frozen_string_literal: true

require "rails_helper"

RSpec.describe Auth::Lti::PickerSubmission do
  let(:instructor)     { FactoryBot.create(:user) }
  let(:context_token)  { SecureRandom.hex(32) }
  let(:cache_key)      { "#{Auth::Lti::DeepLinkingContext::CACHE_KEY_PREFIX}/#{context_token}" }

  let(:cached_payload) do
    {
      "user_id"               => instructor.id,
      "accept_types"          => ["ltiResourceLink"],
      "accept_multiple"       => true,
      "deep_link_return_url"  => "https://canvas.example.com/dl_return",
      "data"                  => "opaque",
      "deployment_id"         => "d1",
      "iss"                   => "https://canvas.example.com",
      "lti_course_context_id" => SecureRandom.uuid
    }
  end

  let(:valid_params) do
    { context_token: context_token, selection: [{ "type" => "ltiResourceLink", "id" => "abc" }] }
  end

  before do
    Rails.cache.clear
  end

  describe "#call" do
    context "when the cache key does not exist (cache miss)" do
      it "returns :unauthorized with code 'expired'" do
        result = described_class.new(valid_params, instructor).call

        expect(result.ok).to be false
        expect(result.status).to eq(:unauthorized)
        expect(result.errors.length).to eq(1)
        expect(result.errors.first[:code]).to eq("expired")
        expect(result.errors.first[:status]).to eq("401")
      end
    end

    context "when the token belongs to a different instructor" do
      let(:other_user) { FactoryBot.create(:user) }

      before do
        Rails.cache.write(cache_key, cached_payload, expires_in: 1.hour)
      end

      it "returns :forbidden with code 'unauthorized'" do
        result = described_class.new(valid_params, other_user).call

        expect(result.ok).to be false
        expect(result.status).to eq(:forbidden)
        expect(result.errors.first[:code]).to eq("unauthorized")
        expect(result.errors.first[:status]).to eq("403")
      end

      it "does not consume the cache key on a forbidden result" do
        described_class.new(valid_params, other_user).call

        expect(Rails.cache.read(cache_key)).to eq(cached_payload)
      end
    end

    context "when context_token is missing" do
      # A blank context_token means the cache key resolves to an empty/nil
      # lookup, which always returns nil — the service correctly treats this
      # as a cache miss (expired/not-found) per the strict validation order:
      # cache read happens before shape validation (CONTEXT.md step 1 → step 3).
      it "returns :unauthorized with code 'expired' (blank token cannot resolve a cache entry)" do
        params = { selection: [{ "type" => "ltiResourceLink", "id" => "x" }] }
        result = described_class.new(params, instructor).call

        expect(result.ok).to be false
        expect(result.status).to eq(:unauthorized)
        expect(result.errors.first[:code]).to eq("expired")
      end
    end

    context "when selection is missing" do
      before do
        Rails.cache.write(cache_key, cached_payload, expires_in: 1.hour)
      end

      it "returns 422 with a per-field error for selection" do
        params = { context_token: context_token }
        result = described_class.new(params, instructor).call

        expect(result.status).to eq(:unprocessable_entity)
        pointers = result.errors.map { |e| e.dig(:source, :pointer) }
        expect(pointers).to include("/data/attributes/selection")
      end
    end

    context "when selection is not an array" do
      before do
        Rails.cache.write(cache_key, cached_payload, expires_in: 1.hour)
      end

      it "returns 422 with pointer '/data/attributes/selection' and detail 'must be an array'" do
        params = { context_token: context_token, selection: "not an array" }
        result = described_class.new(params, instructor).call

        expect(result.status).to eq(:unprocessable_entity)
        error = result.errors.find { |e| e.dig(:source, :pointer) == "/data/attributes/selection" }
        expect(error).to be_present
        expect(error[:detail]).to eq("must be an array")
      end
    end

    context "when a selection item is missing required keys" do
      before do
        Rails.cache.write(cache_key, cached_payload, expires_in: 1.hour)
      end

      it "returns 422 with per-field errors for each missing required key" do
        params = { context_token: context_token, selection: [{ "title" => "x" }] }
        result = described_class.new(params, instructor).call

        expect(result.status).to eq(:unprocessable_entity)
        pointers = result.errors.map { |e| e.dig(:source, :pointer) }
        expect(pointers).to include("/data/attributes/selection/0/type")
        expect(pointers).to include("/data/attributes/selection/0/id")
      end
    end

    context "when the selected type is not in accept_types" do
      before do
        Rails.cache.write(cache_key, cached_payload, expires_in: 1.hour)
      end

      it "returns :bad_request with code 'invalid_selection' and a single error" do
        params = { context_token: context_token, selection: [{ "type" => "file", "id" => "x" }] }
        result = described_class.new(params, instructor).call

        expect(result.ok).to be false
        expect(result.status).to eq(:bad_request)
        expect(result.errors.length).to eq(1)
        expect(result.errors.first[:code]).to eq("invalid_selection")
        expect(result.errors.first[:status]).to eq("400")
      end
    end

    context "when accept_multiple is false and multiple items are submitted" do
      before do
        payload = cached_payload.merge("accept_multiple" => false)
        Rails.cache.write(cache_key, payload, expires_in: 1.hour)
      end

      it "returns :bad_request with a single error describing the multi-resource violation" do
        params = {
          context_token: context_token,
          selection: [
            { "type" => "ltiResourceLink", "id" => "a" },
            { "type" => "ltiResourceLink", "id" => "b" }
          ]
        }
        result = described_class.new(params, instructor).call

        expect(result.ok).to be false
        expect(result.status).to eq(:bad_request)
        expect(result.errors.length).to eq(1)
        expect(result.errors.first[:detail]).to include("single resource")
      end
    end

    context "when all validations pass (happy path)" do
      before do
        Rails.cache.write(cache_key, cached_payload, expires_in: 1.hour)
      end

      it "returns ok: true with status :accepted and no errors" do
        result = described_class.new(valid_params, instructor).call

        expect(result.ok).to be true
        expect(result.status).to eq(:accepted)
        expect(result.errors).to eq([])
      end

      it "consumes the cache key on success (single-use token)" do
        described_class.new(valid_params, instructor).call

        expect(Rails.cache.read(cache_key)).to be_nil
      end
    end

    context "validation order: wrong instructor takes precedence over shape errors" do
      let(:other_user) { FactoryBot.create(:user) }

      before do
        Rails.cache.write(cache_key, cached_payload, expires_in: 1.hour)
      end

      it "returns :forbidden (not 422) when identity fails and selection is malformed" do
        params = { context_token: context_token, selection: [{ "title" => "x" }] }
        result = described_class.new(params, other_user).call

        expect(result.status).to eq(:forbidden)
      end
    end

    context "validation order: shape errors take precedence over business-rule errors" do
      before do
        payload = cached_payload.merge("accept_types" => ["only_this"])
        Rails.cache.write(cache_key, payload, expires_in: 1.hour)
      end

      it "returns :unprocessable_entity (not :bad_request) when selection item is missing 'id' and has a wrong type" do
        params = {
          context_token: context_token,
          selection: [{ "type" => "wrong" }]
        }
        result = described_class.new(params, instructor).call

        expect(result.status).to eq(:unprocessable_entity)
      end
    end
  end
end
