# frozen_string_literal: true

require "rails_helper"

RSpec.describe Auth::IdentityLinker do
  let(:user) { FactoryBot.create(:user) }
  let(:params) { { provider: "lti" } }

  def auth_hash
    OmniAuth::AuthHash.new(
      "provider" => "lti",
      "uid" => "https://canvas.example.com|user-1",
      "info" => { "email" => user.email },
      "extra" => {
        "raw_info" => { "iss" => "https://canvas.example.com" },
        "target_link_uri" => "#{Rails.configuration.manifold.url}/lti/launch?redirect_type=Project&redirect_id=p1"
      }
    )
  end

  def stub_attach(result)
    allow(ExternalAuth::FinalizeIdentityLink).to receive(:new)
      .and_return(instance_double(ExternalAuth::FinalizeIdentityLink, call: result))
  end

  def stub_resolver(redirect_url: "https://host.test/oauth", redirect_query: nil, meta: {}, failure: nil)
    allow(ExternalAuth::Resolver).to receive(:new).and_return(
      instance_double(
        ExternalAuth::Resolver,
        redirect_url: redirect_url, redirect_query: redirect_query, meta: meta, failure: failure
      )
    )
  end

  let(:attached) { Dry::Monads::Result::Success.new(user: user, auth_hash: auth_hash) }
  let(:rejected) { Dry::Monads::Result::Failure.new(:ownership_mismatch) }

  before { Rails.cache.clear }

  describe "#divert_url" do
    subject(:linker) { described_class.new(auth_hash, params) }

    it "stores the login and returns the client link-mode login URL" do
      uri = URI.parse(linker.divert_url(user))
      query = Rack::Utils.parse_nested_query(uri.query)

      expect(uri.path).to eq("/login")
      expect(query).to include("account_link" => user.email)
      expect(ExternalAuth::PendingIdentityLink.find(query["account_link_token"])).to be_owned_by(user)
    end
  end

  describe "#finalize" do
    subject(:linker) { described_class.new(auth_hash, params) }

    it "exposes the user, redirect URL, and redirect params on success" do
      stub_attach(attached)
      stub_resolver(redirect_url: "https://host.test/oauth", redirect_query: "redirect_type=Project")

      link = linker.finalize("tok", user)

      expect(link).to be_success
      expect(link.user).to eq(user)
      expect(link.redirect_url).to eq("https://host.test/oauth")
      expect(link.redirect_query).to eq("redirect_type=Project")
    end

    it "points redirect_url at the login error URL when ownership is rejected" do
      stub_attach(rejected)

      link = linker.finalize("tok", user)

      expect(link).not_to be_success
      expect(link.error).to eq(described_class::ERROR_MESSAGE)
      expect(URI.parse(link.redirect_url).path).to eq("/login")
    end

    it "fails to the login error URL on a deep-linking failure" do
      stub_attach(attached)
      stub_resolver(failure: { message: "bad", status: :bad_request })

      link = linker.finalize("tok", user)

      expect(link).not_to be_success
      expect(URI.parse(link.redirect_url).path).to eq("/login")
    end
  end
end
