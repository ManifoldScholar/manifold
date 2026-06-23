# frozen_string_literal: true

require "rails_helper"

RSpec.describe Lti::DeepLinking::ResponseToken do
  let(:payload) do
    {
      "client_id"            => "tool-client-id",
      "iss"                  => "https://canvas.example.com",
      "deployment_id"        => "deploy-1",
      "deep_link_return_url" => "https://canvas.example.com/dl_return",
      "data"                 => "opaque-platform-data"
    }
  end

  let(:selection) { [{ "url" => "https://manifold.test/projects/intro", "title" => "Intro" }] }

  subject(:jwt) { described_class.new(payload, selection).call }

  def decoded
    public_key = Rails.application.config.manifold.private_key.public_key
    JWT.decode(jwt, public_key, true, algorithms: ["RS256"]).first
  end

  it "signs an RS256 JWT verifiable against the tool's public key" do
    expect { decoded }.not_to raise_error
  end

  it "sets iss to the tool client_id and aud to the platform issuer" do
    expect(decoded).to include("iss" => "tool-client-id", "aud" => "https://canvas.example.com")
  end

  it "carries the response message type, version, and deployment" do
    expect(decoded).to include(
      "https://purl.imsglobal.org/spec/lti/claim/message_type"  => "LtiDeepLinkingResponse",
      "https://purl.imsglobal.org/spec/lti/claim/version"       => "1.3.0",
      "https://purl.imsglobal.org/spec/lti/claim/deployment_id" => "deploy-1"
    )
  end

  it "builds an ltiResourceLink content item per selection with url and title" do
    items = decoded["https://purl.imsglobal.org/spec/lti-dl/claim/content_items"]
    expect(items).to eq([{ "type" => "ltiResourceLink", "url" => "https://manifold.test/projects/intro", "title" => "Intro" }])
  end

  it "echoes the platform data claim when present and omits it otherwise" do
    expect(decoded["https://purl.imsglobal.org/spec/lti-dl/claim/data"]).to eq("opaque-platform-data")

    payload.delete("data")
    expect(described_class.new(payload, selection).call).to satisfy { |t|
      JWT.decode(t, nil, false).first.exclude?("https://purl.imsglobal.org/spec/lti-dl/claim/data")
    }
  end

  it "sets the tool key id in the JWT header so the platform can select the JWK" do
    header = JWT.decode(jwt, nil, false).last
    expect(header["kid"]).to eq(Auth::Jwks.new.kid)
  end
end
