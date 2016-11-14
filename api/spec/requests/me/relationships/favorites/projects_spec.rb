require "rails_helper"

RSpec.configure do |c|
  c.include Helpers
end

RSpec.describe "api/v1/me/favorites", type: :request do
  def build_authenticated_user_with_favorites
    @user, @headers = create_user_and_authenticate.values_at(:user, :headers)
    @user.save
    @favorite_project = FactoryGirl.create(:project)
    @favorite = @user.favorite(@favorite_project)
  end

  # Index action
  describe "GET /api/v1/me/relationships/favorites/projects" do
    context "when there is not an authenticated user" do
      it "responds with a 401 status code" do
        get api_v1_me_relationships_favorite_projects_path
        expect(response).to have_http_status(401)
      end
    end

    context "when there is an authenticated user" do
      before :each do
        build_authenticated_user_with_favorites
        get api_v1_me_relationships_favorite_projects_path, headers: @headers
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
