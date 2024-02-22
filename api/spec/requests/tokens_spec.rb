# frozen_string_literal: true

RSpec.describe "Tokens API", type: :request do
  describe "creates a token" do
    let(:path) { api_v1_tokens_path }
    let(:params) { { email: reader.email, password: password } }
    let(:invalid_params) { { email: reader.email, password: "boogers" } }
    let(:nonexistent_user_params) { { email: "123", password: "123" } }
    let(:api_response) { JSON.parse(response.body) }

    describe "the response" do
      before(:each) { post path, params: params }
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end

      it "returns the token as part of the response meta" do
        token = api_response["meta"]["authToken"]
        expect(token.blank?).to be false
      end

      it "contains the user" do
        type = api_response["data"]["type"]
        id = api_response["data"]["id"]
        expect(type).to eq "users"
        expect(id).to eq(reader.id)
      end

      it "includes private data such as the user's role" do
        role = api_response["data"]["attributes"]["role"]
        expect(role).to eq "reader"
      end
    end

    context "when the username or password are incorrect" do
      before(:each) { post path, params: invalid_params }
      describe "the response" do
        it "has a 401 status code" do
          expect(response).to have_http_status(401)
        end
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
