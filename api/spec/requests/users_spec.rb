# frozen_string_literal: true

RSpec.describe "Users API", type: :request do
  let(:first_name) { "John" }

  let(:attributes) do
    {
      first_name: first_name,
      last_name: "Higgins",
      email: "jon.higgens@example.com",
      password: "testtest123",
      password_confirmation: "testtest123",
      avatar: image_params,
      role: "reader",
    }
  end

  let(:valid_params) do
    build_json_payload(attributes: attributes)
  end

  def params_with_email_offset(offset:, attributes: self.attributes, email_base: "test.email", **options)
    prefix = [email_base, offset].compact_blank.join(?+)

    attributes = attributes.merge(email: "#{prefix}@example.com")

    build_json_payload(attributes: attributes, **options)
  end

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

    before do
      allow(AccountMailer).to receive(:welcome).and_call_original
    end

    def make_request!(headers: anonymous_headers, params: valid_params)
      post path, headers: headers, params: params
    end

    it "creates the user" do
      expect do
        make_request!
      end.to change(User, :count).by(1)

      api_response = JSON.parse(response.body)

      aggregate_failures do
        expect(api_response["data"]["attributes"]["firstName"]).to eq(first_name)

        expect(api_response["data"]["attributes"]["avatarStyles"]["original"]).to be_present

        expect(AccountMailer).to have_received(:welcome).once
      end
    end

    it "is rate-limited" do
      expect do
        7.times do |n|
          make_request! params: params_with_email_offset(offset: n + 1)
        end
      end.to change(User, :count).by(5)
        .and change(ThrottledRequest, :count).by(1)

      expect(response).to have_http_status(503)
    end

    it "tells the welcome mailer that the user was created by the admin when meta[createdByAdmin] is true" do
      valid_params = build_json_payload(attributes: attributes, meta: { created_by_admin: true })

      expect do
        make_request! params: valid_params
      end.to change(User, :count).by(1)

      expect(AccountMailer).to have_received(:welcome).with(anything, created_by_admin: true)
    end

    it "does not tell the welcome mailer that the user was created by the admin when meta[createdByAdmin] is absent" do
      valid_params = build_json_payload(attributes: attributes)

      expect do
        make_request! params: valid_params
      end.to change(User, :count).by(1)

      expect(AccountMailer).to have_received(:welcome).with(anything, created_by_admin: false)
    end

    context "when the ip is blocklisted directly" do
      before do
        Rack::Attack.blocklist_ip("127.0.0.1")
      end

      after do
        Rack::Attack.configuration.anonymous_blocklists.clear
      end

      it "does not allow registration to occur" do
        expect do
          make_request!
        end.to keep_the_same(User, :count)
          .and change(ThrottledRequest, :count).by(1)

        expect(response).to have_http_status(503)
      end
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
