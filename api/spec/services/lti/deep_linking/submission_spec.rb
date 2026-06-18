# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::DeepLinking::Submission do
  let(:user) { FactoryBot.create(:user) }
  let(:context_token) { SecureRandom.hex(32) }
  let(:cache_key) { "#{Lti::DeepLinking::Context::CACHE_KEY_PREFIX}/#{context_token}" }

  let(:payload) do
    {
      "user_id"         => user.id,
      "accept_types"    => ["ltiResourceLink"],
      "accept_multiple" => true
    }
  end

  let(:selection) { [{ "type" => "ltiResourceLink", "id" => "abc" }] }
  let(:params) { { context_token: context_token, selection: selection } }

  subject(:result) { described_class.new(params, user).call }

  before do
    Rails.cache.clear
    Rails.cache.write(cache_key, payload, expires_in: 1.hour)
  end

  it "returns Success and consumes the token on a valid submission" do
    expect(result).to be_success
    expect(Rails.cache.read(cache_key)).to be_nil
  end

  context "when the cache entry is missing" do
    before { Rails.cache.delete(cache_key) }

    it "fails as :unauthorized with code 'expired'" do
      expect(result).to be_failure
      expect(result.failure[:status]).to eq(:unauthorized)
      expect(result.failure[:errors].first[:code]).to eq("expired")
    end
  end

  context "when the token belongs to a different instructor" do
    before { Rails.cache.write(cache_key, payload.merge("user_id" => SecureRandom.uuid), expires_in: 1.hour) }

    it "fails as :forbidden without consuming the token" do
      expect(result.failure[:status]).to eq(:forbidden)
      expect(Rails.cache.read(cache_key)).to be_present
    end
  end

  context "when a selection item is missing required keys" do
    let(:selection) { [{ "title" => "x" }] }

    it "fails as :unprocessable_entity with per-field pointers" do
      expect(result.failure[:status]).to eq(422)
      pointers = result.failure[:errors].map { |e| e.dig(:source, :pointer) }
      expect(pointers).to include("/data/attributes/selection/0/type", "/data/attributes/selection/0/id")
    end
  end

  context "when the selected type is not accepted" do
    let(:selection) { [{ "type" => "file", "id" => "x" }] }

    it "fails as :bad_request with code 'invalid_selection'" do
      expect(result.failure[:status]).to eq(:bad_request)
      expect(result.failure[:errors].first[:code]).to eq("invalid_selection")
    end
  end

  context "when accept_multiple is false and multiple items are submitted" do
    before { Rails.cache.write(cache_key, payload.merge("accept_multiple" => false), expires_in: 1.hour) }

    let(:selection) do
      [{ "type" => "ltiResourceLink", "id" => "a" }, { "type" => "ltiResourceLink", "id" => "b" }]
    end

    it "fails as :bad_request" do
      expect(result.failure[:status]).to eq(:bad_request)
    end
  end
end
