require "rails_helper"

RSpec.describe "Collections API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:collection) { FactoryBot.create(:collection) }

  describe "sends a list of collections" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_collections_path
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "updates a collection" do

    let(:path) { api_v1_collection_path(collection) }

    context "when the user is an admin" do

      let(:headers) { admin_headers }

      describe "the response" do
        context "body" do
          it("contains the updated title") { expect_updated_param("title", "some title") }
          it("contains the updated description") { expect_updated_param("description", "some description") }
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: json_payload()
          expect(response).to have_http_status(200)
        end
      end
    end

    describe "destroys a collection" do

      let(:path) { api_v1_collection_path(collection) }

      context "when the user is an admin" do

        let(:headers) { admin_headers }

        it "has a 204 NO CONTENT status code" do
          delete path, headers: headers
          expect(response).to have_http_status(204)
        end
      end

      context "when the user is a reader" do

        let(:headers) { reader_headers }

        it "has a 403 FORBIDDEN status code" do
          delete path, headers: headers
          expect(response).to have_http_status(403)
        end
      end
    end
  end

end
