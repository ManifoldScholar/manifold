# frozen_string_literal: true

RSpec.describe "Me API", type: :request do
  let(:path) { api_v1_me_path }

  describe "updates the current user" do
    let(:first_name) { "John" }
    let(:last_name) { "Rambozo" }
    let(:update_params) do
      build_json_payload(attributes: { firstName: first_name, lastName: last_name })
    end
    let(:api_response) { JSON.parse(response.body) }

    context "when the user has not authenticated" do
      before(:each) { patch path, params: update_params }
      describe "the response" do
        it "has a 401 status" do
          expect(response).to have_http_status(401)
        end
      end
    end

    context "when the user is a reader" do
      describe "the response" do
        before(:each) { patch path, headers: reader_headers, params: update_params }
        it "has a 200 status" do
          expect(response).to have_http_status(200)
        end
      end

      describe "the current user" do
        let(:headers) { reader_headers }
        it("contains the updated first name") { expect_updated_param("firstName", "Janko") }
        it("contains the updated last name") { expect_updated_param("lastName", "Rambozo") }
        describe "the avatar" do
          let(:params) { build_json_payload(attributes: { avatar: image_params }) }
          before(:each) { patch path, headers: reader_headers, params: params }

          it("has an updated avatar") {
            reader.reload
            expect(reader.avatar.present?).to be true
          }
        end
      end
    end
  end

  describe "sends the current user" do
    context "when the user is a reader" do
      before(:each) { get path, headers: reader_headers }
      let(:api_response) { JSON.parse(response.body) }

      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
        it "contains the logged in user ID" do
          expect(api_response["data"]["id"]).to eq reader.id
        end
      end
    end

    context "when there is not an authenticated user" do
      before(:each) { get path }

      describe "the response" do
        it "has a 401 status code" do
          expect(response).to have_http_status(401)
        end
      end
    end
  end
end
