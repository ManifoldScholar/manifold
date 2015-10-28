require "rails_helper"

RSpec.describe "Texts", type: :request do
  describe "GET /api/v1/texts" do
    it "works! (now write some real specs)" do
      get api_v1_texts_path
      expect(response).to have_http_status(200)
    end
  end
end
