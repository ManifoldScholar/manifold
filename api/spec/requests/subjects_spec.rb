require "rails_helper"

RSpec.describe "api/v1/subjects", type: :request do
  describe "GET /api/v1/subjects" do
    it "responds with a 200 status code" do
      get api_v1_subjects_path
      expect(response).to have_http_status(200)
    end
  end
end
