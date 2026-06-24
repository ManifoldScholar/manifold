# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::DeepLinking::FetchContext do
  let(:user) { FactoryBot.create(:user) }
  let(:context_token) { SecureRandom.hex(32) }
  let(:cache_key) { "#{Lti::DeepLinking::Context::CACHE_KEY_PREFIX}/#{context_token}" }

  let(:payload) do
    {
      "user_id"              => user.id,
      "accept_types"         => ["ltiResourceLink"],
      "accept_multiple"      => true,
      "deep_link_return_url" => "https://canvas.example.com/dl_return",
      "data"                 => "opaque-platform-data",
      "iss"                  => "https://canvas.example.com",
      "client_id"            => "tool-client-id"
    }
  end

  subject(:result) { described_class.new(context_token, user).call }

  before do
    Rails.cache.clear
    Rails.cache.write(cache_key, payload, expires_in: 1.hour)
  end

  it "returns only the picker constraints, never the platform secrets" do
    expect(result).to be_success
    expect(result.value!).to eq(accept_types: ["ltiResourceLink"], accept_multiple: true)
  end

  it "does not consume the token" do
    result
    expect(Rails.cache.read(cache_key)).to eq(payload)
  end

  it "coerces a missing accept_types to an empty array" do
    Rails.cache.write(cache_key, payload.except("accept_types"), expires_in: 1.hour)
    expect(result.value![:accept_types]).to eq([])
  end

  context "when the token is missing or expired" do
    before { Rails.cache.delete(cache_key) }

    it "fails as :unauthorized with code 'expired'" do
      expect(result.failure[:status]).to eq(:unauthorized)
      expect(result.failure[:errors].first[:code]).to eq("expired")
    end
  end

  context "when the requesting user does not own the session" do
    subject(:result) { described_class.new(context_token, FactoryBot.create(:user)).call }

    it "fails as :forbidden with code 'unauthorized'" do
      expect(result.failure[:status]).to eq(:forbidden)
      expect(result.failure[:errors].first[:code]).to eq("unauthorized")
    end
  end
end
