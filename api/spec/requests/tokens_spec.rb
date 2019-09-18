require "swagger_helper"

RSpec.describe "Tokens API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  path '/tokens' do
    let(:created_user) { FactoryBot.create(:user, role: Role::ROLE_ADMIN)}
    post 'Logs in a user' do
      produces 'application/json'
      parameter name: :email, :in => :query, type: :string
      parameter name: :password, :in => :query, type: :string
      tags 'tokens'

      response '200', 'user logged in' do
        let(:email) { created_user.email }
        let(:password) { created_user.password }
        schema '$ref' => '#/definitions/MeResponse'
        run_test!
      end

      response '401', 'user credentials are incorrect' do
        let(:email) { created_user.email }
        let(:password) { '' }
        schema '$ref' => '#/definitions/TokenErrors'
        run_test!
      end
    end
  end

  describe "when getting a token" do
    let(:path) { api_v1_tokens_path }
    let(:params) { { email: reader.email, password: password } }
    let(:invalid_params) { { email: reader.email, password: "boogers" } }
    let(:nonexistent_user_params) { { email: "123", password: "123" } }
    let(:api_response) { JSON.parse(response.body) }

    describe "the response" do
      before(:each) { post path, params: params }
      it "returns the token as part of the response meta" do
        token = api_response["meta"]["authToken"]
        expect(token.blank?).to be false
      end

      it "contains the user" do
        type = api_response["data"]["type"]
        id = api_response["data"]["id"]
        expect(type).to eq ("users")
        expect(id).to eq(reader.id)
      end
    end

    context "when the username or password are incorrect" do
      before(:each) { post path, params: nonexistent_user_params }
      describe "the response" do
        it "has a 401 status code" do
          expect(response).to have_http_status(401)
        end
      end
    end

  end
end
