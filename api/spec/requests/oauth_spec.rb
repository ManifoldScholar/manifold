# frozen_string_literal: true

RSpec.describe "Oauth", type: :request do
  describe "responds with a list of projects" do
    before(:each) { get "/auth/google_oauth2/callback" }

    describe "the response" do
      it "has a non-blank body" do
        expect(response.body.blank?).to be false
      end

      it "has a 200 status code" do
        get api_v1_projects_path
        expect(response).to have_http_status(200)
      end
    end
  end
end
