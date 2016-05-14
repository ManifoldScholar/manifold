require "rails_helper"

RSpec.configure do |c|
  c.include Helpers
end

RSpec.describe "Favorites", type: :request do

  def build_authenticated_user_with_favorites
    @user, @headers = create_user_and_authenticate.values_at(:user, :headers)
    @user.save
    @favorite_project = FactoryGirl.create(:project)
    @not_favorite_project = FactoryGirl.create(:project)
    @favorite_text = FactoryGirl.create(:text)
    @favorite = @user.favorite(@favorite_project)
    @another_favorite = @user.favorite(@favorite_text)
    @params = {
      data: {
        type: "favorites",
        attributes: {},
        relationships: {
          favoritable: {
            data: {
              type: "projects",
              id: @not_favorite_project.id
            }
          }
        }
      }
    }
  end

  # Index action
  describe "GET /api/v1/me/relationships/favorites" do

    context "when there is not an authenticated user" do
      it "responds with a 401 status code" do
        get api_v1_me_relationships_favorites_path
        expect(response).to have_http_status(401)
      end

    end

    context "when there is an authenticated user" do
      before :each do
        build_authenticated_user_with_favorites
        get api_v1_me_relationships_favorites_path, headers: @headers
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

  # Create action
  describe "POST /api/v1/me/relationships/favorites" do

    context "when there is not an authenticated user" do
      it "responds with a 401 status code" do
        post api_v1_me_relationships_favorites_path
        expect(response).to have_http_status(401)
      end
    end

    context "when there is an authenticated user" do
      before :each do
        build_authenticated_user_with_favorites
        post api_v1_me_relationships_favorites_path, headers: @headers, params: @params
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
        expect(api_response["data"]["relationships"]["favoritable"]["data"]["id"]).to eq(@not_favorite_project.id.to_s)
      end
    end

  end

  # Show action
  describe "GET /api/v1/me/relationships/favorites/:id" do

    before :each do
      build_authenticated_user_with_favorites
    end

    context "when there is not an authenticated user" do
      it "responds with a 401 status code" do
        delete api_v1_me_relationships_favorite_path(@favorite)
        expect(response).to have_http_status(401)
      end
    end

    context "when there is an authenticated user" do
      before :each do
        delete api_v1_me_relationships_favorite_path(@favorite), headers: @headers, params: @params
        @response = response
      end

      it "responds with a 204 status code" do
        expect(@response).to have_http_status(204)
      end
    end

  end

  # Destroy action
  describe "DELETE /api/v1/me/relationships/favorites/:id" do

    before :each do
      build_authenticated_user_with_favorites
    end


    context "when there is not an authenticated user" do
      it "responds with a 401 status code" do
        delete api_v1_me_relationships_favorite_path(@favorite)
        expect(response).to have_http_status(401)
      end
    end

    context "when there is an authenticated user" do
      before :each do
        build_authenticated_user_with_favorites
        get api_v1_me_relationships_favorite_path(@favorite), headers: @headers, params: @params
        @response = response
      end

      it "responds with a 201 status code" do
        expect(@response).to have_http_status(200)
      end

    end

  end


end
