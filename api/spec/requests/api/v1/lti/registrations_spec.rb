# frozen_string_literal: true

RSpec.describe "LTI Registrations admin API", type: :request do
  let!(:registration) { FactoryBot.create(:lti_registration, :pending, issuer: "https://canvas.example.com") }

  describe "GET /api/v1/lti/registrations" do
    let(:path) { api_v1_lti_registrations_path }

    it "lists registrations for an admin" do
      get path, headers: admin_headers

      expect(response).to be_successful
    end

    it "forbids a reader" do
      get path, headers: reader_headers

      expect(response).to have_http_status :forbidden
    end

    it "rejects an unauthenticated request" do
      get path, headers: anonymous_headers

      expect(response).to have_http_status(:forbidden).or have_http_status(:unauthorized)
    end
  end

  describe "PUT /api/v1/lti/registrations/:id/approve" do
    it "approves a pending registration" do
      put approve_api_v1_lti_registration_path(registration), headers: admin_headers

      expect(response).to be_successful
      expect(registration.reload).to be_approved
    end

    it "forbids a reader" do
      put approve_api_v1_lti_registration_path(registration), headers: reader_headers

      expect(response).to have_http_status :forbidden
    end

    it "rejects a transition the state machine disallows" do
      registration.transition_to!(:approved)

      put approve_api_v1_lti_registration_path(registration), headers: admin_headers

      expect(response).to have_http_status :unprocessable_entity
    end

    it "reverses a block" do
      registration.transition_to!(:blocked)

      put approve_api_v1_lti_registration_path(registration), headers: admin_headers

      expect(registration.reload).to be_approved
    end
  end

  describe "PUT /api/v1/lti/registrations/:id/deny" do
    it "denies the registration" do
      put deny_api_v1_lti_registration_path(registration), headers: admin_headers

      expect(registration.reload).to be_denied
    end
  end

  describe "PUT /api/v1/lti/registrations/:id/block" do
    it "blocks the registration and its host" do
      put block_api_v1_lti_registration_path(registration), headers: admin_headers

      expect(registration.reload).to be_blocked
      expect(LtiRegistration.blocked).to exist(host: registration.host)
    end
  end

  describe "DELETE /api/v1/lti/registrations/:id" do
    it "destroys the registration" do
      delete api_v1_lti_registration_path(registration), headers: admin_headers

      expect(LtiRegistration).not_to exist(id: registration.id)
    end

    it "forbids a reader" do
      delete api_v1_lti_registration_path(registration), headers: reader_headers

      expect(response).to have_http_status :forbidden
    end
  end
end
