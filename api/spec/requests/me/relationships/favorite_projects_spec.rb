# frozen_string_literal: true

RSpec.describe "My Favorite Projects API", type: :request do
  let(:path) { api_v1_me_relationships_favorite_projects_path }

  # Index action
  describe "sends the user's favorite projects" do
    context "when the user is not authenticated" do
      it "has a 401 status code" do
        get path
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when the user is authenticated" do
      let(:favorite_project) { FactoryBot.create(:project) }
      let(:favorite) { reader.favorite(favorite_project) }

      before { favorite }
      before { get path, headers: reader_headers }

      let(:api_response) { response.parsed_body }

      it "sends the correct favorite project" do
        expect(api_response["data"][0]["id"]).to eq favorite_project.id
      end

      it "sends an array of data" do
        expect(api_response["data"]).to be_instance_of Array
      end

      it "has a 200 status code" do
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
