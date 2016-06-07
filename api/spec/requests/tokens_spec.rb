require "rails_helper"

RSpec.describe "api/v1/tokens", type: :request do
  describe "POST /api/v1/tokens" do

    def create_token
      email = "john@rambo.com"
      password = "testtest123"
      user = FactoryGirl.create(:user, email: email, password: password, password_confirmation: password)
      post api_v1_tokens_path, params: {email: email, password: password}
      return user
    end

    it "responds with a 200 status code" do
      create_token
      expect(response).to have_http_status(200)
    end

    it "returns the token as part of the response meta" do
      create_token
      parsed = JSON.parse(response.body)
      token = parsed["meta"]["authToken"]
      expect(token.blank?).to be false
    end

    it "returns the user as part of the response data" do
      user = create_token
      parsed = JSON.parse(response.body)
      type = parsed["data"]["type"]
      id = parsed["data"]["id"]
      expect(type).to eq ("users")
      expect(id).to eq(user.id)
    end

    it "responds with a 401 status code if the username and password are incorrect" do
      email = "john@rambo.com"
      password = "testtest123"
      FactoryGirl.create(:user, email: email, password: password, password_confirmation: password)
      post api_v1_tokens_path, params: {email: email, password: "wrongpassword"}
      expect(response).to have_http_status(401)
    end

    it "responds with a 401 status code if no user exists" do
      email = "123"
      password = "123"
      post api_v1_tokens_path, params: {email: email, password: password}
      expect(response).to have_http_status(401)
    end

  end
end
