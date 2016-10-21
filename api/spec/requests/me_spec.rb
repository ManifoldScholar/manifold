require "rails_helper"

RSpec.configure do |c|
  c.include Helpers
end

RSpec.describe "api/v1/me", type: :request do
  def build_authenticated_user
    @user, @headers = create_user_and_authenticate.values_at(:user, :headers)
    @user.save
  end

  describe "PUT /api/v1/me" do
    it "updates the first and last name" do
      build_authenticated_user
      params = {
        data: {
          type: "user",
          id: @user.id,
          attributes: {
            first_name: "Jimbo",
            last_name: "Higgins"
          }
        }
      }
      put api_v1_me_path, headers: @headers, params: params
      api_response = JSON.parse(response.body)
      expect(api_response["data"]["attributes"]["firstName"]).to eq("Jimbo")
    end

    it "accepts an avatar file upload and adds it to the user" do
      build_authenticated_user
      params = {
        data: {
          type: "user",
          id: @user.id,
          attributes: {
            avatar: {
              content_type: "image/png",
              data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAA8SURBVDhPY2RgYPgPxFQBjCDDFjExU2xY3L+/DEwUm4JkwKhhpIfmaJiNhhmOEBhNGqQnDXDhSLo27DoAUSQGIRjvqU4AAAAASUVORK5CYII=",
              filename: "box.png"
            }
          }
        }
      }
      put api_v1_me_path, headers: @headers, params: params
      user = @user.reload
      expect(user.avatar.present?).to be true
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
