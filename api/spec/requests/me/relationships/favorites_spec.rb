require "swagger_helper"

RSpec.describe "My Favorites API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")


  let(:model) { FactoryBot.create(:favorite) }
  let(:user_id) { model[:user_id] }
  let(:project_id) { model[:favoritable_id] }
  let(:favorite_id) { model[:id] }

  tags = ''
  model_name = 'favorite'
  model_name_plural = 'favorites'

  get_model = { '$ref' => '#/definitions/FavoriteGet' }

  create_request = { '$ref' => '#/definitions/FavoriteCreateRequest' }
  create_response = { '$ref' => '#/definitions/FavoriteCreateResponse' }

  # update_request = { '$ref' => '#/definitions/FavoriteUpdateRequest' }
  # update_response = { '$ref' => '#/definitions/FavoriteUpdateResponse' }

  path "/me/relationships/#{model_name_plural}" do
    get I18n.t('swagger.get.one.description', type: model_name_plural, attribute: 'user auth') do
      security [ apiKey: [] ]
      produces 'application/json'
      tags tags

      response '200', I18n.t('swagger.get.one.200', type: model_name_plural, attribute: 'user auth') do
        let(:Authorization) { admin_auth }
        schema get_model
        run_test!
      end
    end

    post I18n.t('swagger.post.description', type: model_name) do
      parameter name: :body, in: :body, schema: create_request
      let(:body) {
        json_structure({
          relationships: {
            favoritable: {
              data: {
                id: project_id,
                type: "Project"
              }
            }
          }
        })
      }

      consumes 'application/json'
      produces 'application/json'

      security [ apiKey: [] ]
      tags tags

      response '201', I18n.t('swagger.post.201', type: model_name) do
        let(:Authorization) { admin_auth }
        schema create_response
        run_test!
      end
    end
  end

  # TODO what should be in the place of the favorite_id that I put there?
  # should the user own the project that has been favorited?
  # path "/me/relationships/#{model_name_plural}/{favorite_id}" do
  #   attribute = 'ID'
  #
  #   get I18n.t('swagger.get.one.description', type: model_name, attribute: attribute) do
  #     parameter name: :favorite_id, :in => :path, :type => :string
  #
  #     produces 'application/json'
  #
  #     security [ apiKey: [] ]
  #     tags tags
  #
  #     response '200', I18n.t('swagger.get.one.200', type: model_name, attribute: attribute) do
  #       let(:Authorization) { admin_auth }
  #       schema get_model
  #       run_test!
  #     end
  #   end
  #
  #   patch I18n.t('swagger.patch.description', type: model_name, attribute: attribute) do
  #     parameter name: :id, :in => :path, :type => :string
  #     let(:id) { model[:id] }
  #
  #     parameter name: :body, in: :body, schema: update_request
  #     let(:body) { json_structure_for(model_name) }
  #
  #     consumes 'application/json'
  #     produces 'application/json'
  #
  #     security [ apiKey: [] ]
  #     tags tags
  #
  #     response '200', I18n.t('swagger.patch.200', type: model_name, attribute: attribute) do
  #       let(:Authorization) { admin_auth }
  #       schema update_response
  #       run_test!
  #     end
  #
  #     response '403', I18n.t('swagger.access_denied', type: model_name, attribute: attribute) do
  #       let(:Authorization) { reader_auth }
  #       run_test!
  #     end
  #   end
  #
  #   delete I18n.t('swagger.delete.description', type: model_name, attribute: attribute) do
  #     parameter name: :id, :in => :path, :type => :string
  #     let(:id) { model[:id] }
  #
  #     security [ apiKey: [] ]
  #     tags tags
  #
  #     response '204', I18n.t('swagger.delete.204', type: model_name, attribute: attribute) do
  #       let(:Authorization) { admin_auth }
  #       run_test!
  #     end
  #
  #     response '403', I18n.t('swagger.access_denied') do
  #       let(:Authorization) { author_auth }
  #       run_test!
  #     end
  #   end
  # end

  let(:another_user) { FactoryBot.create(:user) }
  let(:unfavorited_project) { FactoryBot.create(:project) }
  let(:favorite_project) { FactoryBot.create(:project) }
  let(:reader_favorite) { reader.favorite(favorite_project) }
  let(:not_my_favorite) { another_user.favorite(favorite_project) }
  let(:params) {
    relationships = {
      favoritable: {
        data: {
          type: "projects",
          id: unfavorited_project.id
        }
      }
    }
    json_payload(relationships: relationships)
  }

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
