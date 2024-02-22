# frozen_string_literal: true

RSpec.describe "My Favorites API", type: :request do
  let(:another_user) { FactoryBot.create(:user) }
  let(:unfavorited_project) { FactoryBot.create(:project) }
  let(:favorite_project) { FactoryBot.create(:project) }
  let(:reader_favorite) { reader.favorite(favorite_project) }
  let(:not_my_favorite) { another_user.favorite(favorite_project) }
  let(:params) do
    relationships = {
      favoritable: {
        data: {
          type: "projects",
          id: unfavorited_project.id
        }
      }
    }
    build_json_payload(relationships: relationships)
  end

  describe "sends my favorites" do
    let(:path) { api_v1_me_relationships_favorites_path }

    context "when the user is not authenticated" do
      before(:each) { get path }
      it "has a 401 status code" do
        expect(response).to have_http_status(401)
      end
    end

    context "when the user is a reader" do

      before(:each) { get path, headers: reader_headers }
      let(:api_response) { JSON.parse(response.body) }

      describe "the response" do

        it "includes an array of data" do
          expect(api_response["data"]).to be_instance_of Array
        end
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  describe "creates a favorite" do

    let(:path) { api_v1_me_relationships_favorites_path }

    context "when the user is not authenticated" do

      before(:each) { post path }

      describe "the response" do

        it "has a 401 status code" do
          expect(response).to have_http_status(401)
        end
      end
    end

    context "when there is an authenticated user" do

      before(:each) { post path, headers: reader_headers, params: params}
      let(:api_response) { JSON.parse(response.body) }

      describe "the response" do
        it "has a 201 status code" do
          expect(response).to have_http_status(201)
        end

        it "includes the current user id" do
          expect(api_response["data"]["id"]).to eq reader.id
        end

        it "includes the type property" do
          expect(api_response["data"]["type"]).to eq "users"
        end
      end

      it "adds the favorite to the user's favorites" do
        expect(reader.favorite?(unfavorited_project)).to be true
      end
    end
  end

  # Show action
  describe "sends a favorite" do

    let(:path) { api_v1_me_relationships_favorite_path(reader_favorite) }
    let(:your_path) { api_v1_me_relationships_favorite_path(not_my_favorite) }

    context "when there is not an authenticated user" do
      before(:each) { get path }
      describe "the response" do
        it "has a 401 status code" do
          expect(response).to have_http_status(401)
        end
      end
    end

    context "when there is an authenticated user" do
      before(:each) { get path, headers: reader_headers }
      describe "the response" do
        it "has a 204 status code" do
          expect(@response).to have_http_status(200)
        end
      end

    end
  end

  # Destroy action
  describe "destroys a favorite" do

    let(:path) { api_v1_me_relationships_favorite_path(reader_favorite) }

    context "when the user has not authenticated" do
      before(:each) { delete path}
      describe "the response" do
        it "has a 401 status code" do
          expect(response).to have_http_status(401)
        end
      end
    end

    context "when the user is a reader" do
      before(:each) { delete path, headers: reader_headers }
      describe "the response" do
        it "has a 204 no content status code" do
          expect(response).to have_http_status(204)
        end
      end
      describe "the favorite" do
        it "is destroyed" do
          expect(reader.favorite?(reader_favorite)).to be false
        end
      end
    end
  end
end
