require "rails_helper"

RSpec.configure do |c|
  c.include Helpers
end

RSpec.describe "Me", type: :request do

  describe "GET /api/v1/me" do

    context "when there is an authenticated user" do

      before :each do
        @user, @headers = create_user_and_authenticate.values_at(:user, :headers)
        get api_v1_me_path, headers: @headers
        @response = response
        @api_response = JSON.parse(@response.body)
      end

      it "responds with a 200 status code" do
        expect(@response).to have_http_status(200)
      end

      it "responds with the currently logged in user" do
        expect(@api_response["data"]["id"]).to eq @user.id.to_s
      end
    end

    context "when there is not an authenticated user" do

      before :each do
        get api_v1_me_path
        @response = response
      end

      it "responds with a 401 status code" do
        expect(@response).to have_http_status(401)
      end

    end

  end
end
