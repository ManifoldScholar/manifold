# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::DeepLinking::HandleSubmission do
  let(:user) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project) }
  let(:course_context) { FactoryBot.create(:lti_course_context, context_title: "Intro to Ruby") }
  let(:context_token) { SecureRandom.hex(32) }
  let(:cache_key) { "#{Lti::DeepLinking::Context::CACHE_KEY_PREFIX}/#{context_token}" }

  let(:payload) do
    {
      "user_id"               => user.id,
      "client_id"             => "tool-client-id",
      "iss"                   => "https://canvas.example.com",
      "deployment_id"         => "deploy-1",
      "deep_link_return_url"  => "https://canvas.example.com/dl_return",
      "accept_types"          => ["ltiResourceLink"],
      "accept_multiple"       => true,
      "lti_course_context_id" => course_context.id
    }
  end

  let(:selection) { [{ "type" => "Project", "id" => project.id, "title" => "Intro" }] }
  let(:params) { { context_token: context_token, selection: selection } }

  subject(:result) { described_class.new(params, user).call }

  before do
    Rails.cache.clear
    Rails.cache.write(cache_key, payload, expires_in: 1.hour)
  end

  it "validates, provisions the group, signs the response, and consumes the token" do
    expect { result }.to change(ReadingGroup, :count).by(1)

    expect(result).to be_success
    expect(result.value!).to include(deep_link_return_url: "https://canvas.example.com/dl_return")
    expect(result.value![:jwt]).to be_a(String)
    expect(Rails.cache.read(cache_key)).to be_nil
  end

  context "when the cache entry is missing" do
    before { Rails.cache.delete(cache_key) }

    it "fails as :unauthorized" do
      expect(result.failure[:status]).to eq(:unauthorized)
      expect(result.failure[:errors].first.title).to eq("Context Expired")
    end
  end

  context "when the token belongs to a different instructor" do
    before { Rails.cache.write(cache_key, payload.merge("user_id" => SecureRandom.uuid), expires_in: 1.hour) }

    it "fails as :forbidden without consuming the token" do
      expect(result.failure[:status]).to eq(:forbidden)
      expect(Rails.cache.read(cache_key)).to be_present
    end
  end

  context "when the selection is invalid" do
    let(:selection) { [{ "title" => "x" }] }

    it "propagates the validation failure and does not consume the token" do
      expect(result.failure[:status]).to eq(422)
      expect(Rails.cache.read(cache_key)).to be_present
    end
  end
end
