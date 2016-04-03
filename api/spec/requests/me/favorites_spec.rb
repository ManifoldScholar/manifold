require "rails_helper"

RSpec.configure do |c|
  c.include Helpers
end

RSpec.describe "Favorites", type: :request do

  describe "POST /api/v1/me/favorites" do

    context "when there is not an authenticated user" do
      it "responds with a 401 status code" do
        post api_v1_me_favorites_path
        expect(response).to have_http_status(401)
      end
    end

    context "when there is not an authenticated user" do

      before :each do
        @user, @headers = create_user_and_authenticate.values_at(:user, :headers)
        @user.save
        @project = FactoryGirl.create(:project)
        @params = {
          data: {
            type: "favorites",
            attributes: {},
            relationships: {
              favoritable: {
                data: {
                  type: "projects",
                  id: @project.id
                }
              }
            }
          }
        }
        post api_v1_me_favorites_path, headers: @headers, params: @params
        @response = response
      end

      it "responds with a 201 status code" do
        expect(@response).to have_http_status(201)
      end

      it "responds with a new favorite" do
        api_response = JSON.parse(@response.body)
        expect(api_response["data"]["id"].blank?).not_to be_nil
      end

      it "creates a favorite with the correct favoritable" do
        api_response = JSON.parse(@response.body)
        expect(api_response["data"]["relationships"]["favoritable"]["data"]["id"]).to eq(@project.id.to_s)
      end

    end
  end

  describe "GET /api/v1/me/favorites" do

    before :each do
      @user, @headers = create_user_and_authenticate.values_at(:user, :headers)
      @user.save
      @favorite_project = FactoryGirl.create(:project)
      @favorite_text = FactoryGirl.create(:text)
      @user.favorites.create(favoritable: @favorite_project)
      @user.favorites.create(favoritable: @favorite_text)
    end

    context "when there is not an authenticated user" do

      before :each do
        get api_v1_me_favorites_path
        @response = response
      end

      it "responds with a 401 status code" do
        expect(@response).to have_http_status(401)
      end

    end

    context "when there is an authenticated user" do

      before :each do
        get api_v1_me_favorites_path, headers: @headers
        @response = response
        @api_response = JSON.parse(response.body)
      end

      it "responds with an array of data" do
        expect(@api_response["data"]).to be_instance_of Array
      end

      it "responds with an 200 status code" do
        expect(@response).to have_http_status(200)
      end

    end



  end
end
