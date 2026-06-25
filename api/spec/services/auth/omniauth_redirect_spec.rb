# frozen_string_literal: true

require "rails_helper"

RSpec.describe Auth::OmniauthRedirect do
  let(:manifold_url) { Rails.configuration.manifold.url }
  let(:params) { { provider: "lti" } }

  def redirect_query(omniauth)
    URI.parse(described_class.new(omniauth, params).redirect_url).then do |uri|
      Rack::Utils.parse_nested_query(uri.query)
    end
  end

  context "an LTI launch whose target_link_uri carries redirect_type/redirect_id" do
    let(:omniauth) do
      { "extra" => { "target_link_uri" => "#{manifold_url}/lti/launch?redirect_type=Project&redirect_id=abc-123" } }
    end

    it "emits redirect_type/redirect_id for the client to build the URL" do
      query = redirect_query(omniauth)
      expect(query).to include("redirect_type" => "Project", "redirect_id" => "abc-123")
      expect(query).not_to have_key("redirect_path")
    end
  end

  context "an LTI launch with a plain target_link_uri (no redirect params)" do
    let(:omniauth) { { "extra" => { "target_link_uri" => "#{manifold_url}/projects/intro" } } }

    it "falls back to redirect_path" do
      query = redirect_query(omniauth)
      expect(query["redirect_path"]).to eq("/projects/intro")
      expect(query).not_to have_key("redirect_type")
    end
  end
end
