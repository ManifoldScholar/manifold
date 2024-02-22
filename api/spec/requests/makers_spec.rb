# frozen_string_literal: true

RSpec.describe "Makers API", type: :request do
  let(:maker) { FactoryBot.create(:maker) }

  describe "sends a list of makers" do
    before(:each) { get api_v1_makers_path, headers: reader_headers }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "sends a single maker" do
    let(:path) { api_v1_maker_path(maker) }

    context "when the user is an reader" do
      before(:each) { get path, headers: reader_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { get path, headers: admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  describe "updates a maker" do

    let(:path) { api_v1_maker_path(maker) }

    context "when the user is an admin" do

      let(:headers) { admin_headers }

      describe "the response" do
        context "body" do
          it("contains the updated first_name") { expect_updated_param("firstName", "john") }
          it("contains the updated last_name") { expect_updated_param("lastName", "smith") }
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: build_json_payload()
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  describe "creates a maker" do
    let(:path) { api_v1_makers_path }
    let(:params) {
      build_json_payload(attributes: {
        firstName: "John",
        lastName: "Rambo"
      })
    }

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      it("returns a saved maker") do
        post path, headers: headers, params: params
        api_response = JSON.parse(response.body)
        expect(api_response["data"]["id"]).to_not be nil
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      describe "the response" do
        it "has a 403 status code" do
          post path, headers: headers, params: params
          expect(response).to have_http_status(403)
        end
      end
    end
  end

end
