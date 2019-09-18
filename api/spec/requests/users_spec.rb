require "swagger_helper"

RSpec.describe "Users API", type: :request do
  model_name = "user"
  model_name_plural = "users"
  request_create_schema = { '$ref' => '#/definitions/UserRequestCreate' }
  request_update_schema = { '$ref' => '#/definitions/UserRequestUpdate' }
  response_schema = { '$ref' => '#/definitions/UserResponse' }
  response_schema_full = { '$ref' => '#/definitions/UsersResponse' }

  include_context("authenticated request")
  include_context("param helpers")

  let(:first_name) { "John" }
  let(:attributes) {
    {
      first_name: first_name,
      last_name: "Higgins",
      password: "testtest123",
      email: "jon@higgins.com",
      password_confirmation: "testtest123",
      avatar: image_params,
      role: "reader"
    }
  }
  let(:valid_params) {
    json_payload(attributes: attributes)
  }
  let(:existing_user) { FactoryBot.create(:user) }

  path "/#{model_name_plural}" do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do
      produces 'application/json'
      security [ apiKey: [] ]
      tags model_name_plural

      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do
        let(:Authorization) { admin_auth }
        schema response_schema_full
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end

    post I18n.t('swagger.post.description', type: model_name) do
      consumes 'application/json'
      produces 'application/json'
      parameter name: :user, in: :body, schema: request_create_schema
      tags model_name_plural

      response '201', I18n.t('swagger.post.201', type: model_name) do
        let(:user) { { data: { attributes: FactoryBot.attributes_for(model_name) }} }
        schema response_schema
        run_test!
      end
    end
  end

  path "/#{model_name_plural}/{id}" do
    get I18n.t('swagger.get.one.description', type: model_name, attribute: 'id') do
      produces 'application/json'

      parameter name: :id, in: :path, :type => :string
      let(:id) { reader[:id] }

      security [ apiKey: [] ]
      tags model_name_plural

      response '200', I18n.t('swagger.get.one.200', type: model_name, attribute: 'id') do
        let(:Authorization) { admin_auth }
        schema response_schema
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: model_name, attribute: 'id') do
      consumes 'application/json'
      produces 'application/json'

      parameter name: :id, in: :path, :type => :string
      let(:id) { reader[:id] }

      parameter name: :user, in: :body, schema: response_schema
      let(:user) { { data: { attributes: { first_name: first_name } } } }

      security [ apiKey: [] ]
      tags model_name_plural

      response '200', I18n.t('swagger.patch.200', type: model_name, attribute: 'id') do
        let(:Authorization) { admin_auth }
        schema response_schema
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end

    delete 'User removed' do

      parameter name: :id, in: :path, :type => :string
      let(:id) { reader[:id] }

      security [ apiKey: [] ]
      tags model_name_plural

      response '204', I18n.t('swagger.delete.description', type: model_name, attribute: 'id') do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end

  path '/users/whoami' do
    get 'Return information on the current user' do
      security [ apiKey: [] ]
      tags model_name_plural

      response '200', 'Returns the user with the matching authorization token' do
        let(:Authorization) { admin_auth }
        schema response_schema
        run_test!
      end
    end
  end

  describe "creates a user" do
    let(:path) { api_v1_users_path }

    context do
      let(:api_response) { JSON.parse(response.body) }
      before(:each) { allow(AccountMailer).to receive(:welcome).and_call_original }
      before(:each) { post path, headers: anonymous_headers, params: valid_params }
      it "sets the first name correctly" do
        expect(api_response["data"]["attributes"]["firstName"]).to eq(first_name)
      end

      it "accepts an avatar file upload and adds it to the user" do
        url = api_response["data"]["attributes"]["avatarStyles"]["original"]
        expect(url.blank?).to be false
      end

      it "sends a welcome message" do
        expect(AccountMailer).to have_received(:welcome).once
      end
    end

    it "tells the welcome mailer that the user was created by the admin when meta[createdByAdmin] is true" do
      valid_params = json_payload(attributes: attributes, meta: { created_by_admin: true })
      allow(AccountMailer).to receive(:welcome).and_call_original
      post path, headers: anonymous_headers, params: valid_params
      expect(AccountMailer).to have_received(:welcome).with(anything, true)
    end

    it "does not tell the welcome mailer that the user was created by the admin when meta[createdByAdmin] is absent" do
      valid_params = json_payload(attributes: attributes)
      allow(AccountMailer).to receive(:welcome).and_call_original
      post path, headers: anonymous_headers, params: valid_params
      expect(AccountMailer).to have_received(:welcome).with(anything, false)
    end
  end

  describe "sends a user" do

    let(:path) { api_v1_user_path(reader) }
    let(:api_response) { JSON.parse(response.body) }

    context "when the user is the user being requested" do
      before(:each) { get path, headers: reader_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(@response).to have_http_status(200)
        end
      end
    end

    context "when the user is somebody else" do
      before(:each) { get path, headers: author_headers }
      describe "the response" do
        it "has a 403 status code" do
          expect(@response).to have_http_status(403)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { get path, headers: admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(@response).to have_http_status(200)
        end
      end
    end
  end

  describe "sends the current user" do

    let(:path) { whoami_api_v1_users_path() }
    let(:api_response) { JSON.parse(response.body) }

    context "when the user is a reader" do
      before(:each) { get path, headers: reader_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(@response).to have_http_status(200)
        end

        it "contains the correct user" do
          expect(api_response["data"]["id"]).to eq(reader.id)
        end
      end
    end
  end
end
