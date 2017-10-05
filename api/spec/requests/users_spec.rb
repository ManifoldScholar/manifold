require "rails_helper"

RSpec.describe "Users API", type: :request do

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

  describe "sends a list of users" do
    let(:path) { api_v1_users_path }
    context "when the user is an reader" do
      before(:each) { get path, headers: reader_headers }
      describe "the response" do
        it "has a 403 status code" do
          expect(@response).to have_http_status(403)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { get path, headers: admin_headers}
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
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

  describe "destroys a user" do

    let(:path) { api_v1_user_path(reader) }
    let(:api_response) { JSON.parse(response.body) }

    context "when the user is an admin" do
      before(:each) { delete path, headers: admin_headers }
      describe "the response" do
        it "has a 204 status code" do
          expect(@response).to have_http_status(204)
        end
      end
    end

    context "when the user is a reader" do
      before(:each) { delete path, headers: reader_headers }
      describe "the response" do
        it "has a 403 status code" do
          expect(@response).to have_http_status(403)
        end
      end
    end
  end
end
