# frozen_string_literal: true

RSpec.describe "Pages API", type: :request do
  describe "sends a page" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_pages_path
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
