# frozen_string_literal: true

require "rails_helper"

RSpec.describe "LTI Registrations admin API", type: :request do
  let!(:registration) { FactoryBot.create(:lti_registration, issuer: "https://evil.example.com") }

  describe "GET /api/v1/lti/registrations" do
    it "lists registrations for an admin" do
      get "/api/v1/lti/registrations", headers: build_headers_for(admin)
      expect(response).to have_http_status(:ok)
    end

    it "forbids a non-admin" do
      get "/api/v1/lti/registrations", headers: build_headers_for(reader)
      expect(response).to have_http_status(:forbidden)
    end

    it "rejects an unauthenticated request" do
      get "/api/v1/lti/registrations", headers: anonymous_headers
      expect(response).to have_http_status(:forbidden).or have_http_status(:unauthorized)
    end
  end

  describe "PATCH /api/v1/lti/registrations/:id" do
    it "lets an admin disable a registration" do
      patch "/api/v1/lti/registrations/#{registration.id}",
            params: { data: { attributes: { enabled: false } } }.to_json,
            headers: build_headers_for(admin)

      expect(response).to have_http_status(:ok)
      expect(registration.reload.enabled).to be false
    end
  end

  describe "DELETE /api/v1/lti/registrations/:id" do
    it "deletes the registration without touching the blocklist by default" do
      expect do
        delete "/api/v1/lti/registrations/#{registration.id}", headers: build_headers_for(admin)
      end.to change(LtiRegistration, :count).by(-1)

      expect(Settings.instance.lti.issuer_blocklist).to be_empty
    end

    it "blocklists the issuer host when blocklist=true" do
      delete "/api/v1/lti/registrations/#{registration.id}?blocklist=true", headers: build_headers_for(admin)

      expect(response).to have_http_status(:no_content)
      expect(Settings.instance.lti.issuer_blocklist).to include("evil.example.com")
    end

    it "forbids a non-admin" do
      delete "/api/v1/lti/registrations/#{registration.id}", headers: build_headers_for(reader)
      expect(response).to have_http_status(:forbidden)
    end
  end
end
