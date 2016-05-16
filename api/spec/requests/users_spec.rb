require "rails_helper"

RSpec.configure do |c|
  c.include Helpers
end

RSpec.describe "User", type: :request do
  describe "POST /api/v1/users" do
    it "creates a new user" do
      params = {
        data: {
          type: "user",
          attributes: {
            first_name: "John",
            last_name: "Higgins",
            password: "testtest123",
            email: "jon@higgins.com",
            password_confirmation: "testtest123"
          }
        }
      }
      post api_v1_users_path, params: params
      api_response = JSON.parse(response.body)
      expect(api_response["data"]["attributes"]["firstName"]).to eq("John")
    end

    it "accepts an avatar file upload and adds it to the user" do
    end

    it "removes the user's avatar if remove_avatar param is true" do
    end
  end

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
