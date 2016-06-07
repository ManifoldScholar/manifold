require "rails_helper"

RSpec.describe "api/v1/texts", type: :request do
  describe "GET /api/v1/texts" do
    it "responds with a 200 status code" do
      get api_v1_texts_path
      expect(response).to have_http_status(200)
    end
  end
end
