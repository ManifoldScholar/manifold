# frozen_string_literal: true

RSpec.describe "Resources API", type: :request do
  let_it_be(:resource, refind: true) { FactoryBot.create(:resource) }

  describe "updates a resource" do
    let(:path) { api_v1_resource_path(resource) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      let(:metadata) do
        {
          "rights" => "Free",
          "rightsTerritory" => "USA",
          "restrictions" => "No Bozos",
          "creator" => "Biff McFly"
        }
      end

      describe "the response" do
        context "body" do
          it("contains the updated title") { expect_updated_param("title", "some title") }
          it("contains the updated caption") { expect_updated_param("caption", "some caption") }
          it("contains the updated description") { expect_updated_param("description", "some description") }
          it("contains the updated tag_list") { expect_updated_param("tagList", %w(glorp glomp), %w(glorp glomp)) }
          it("contains the updated alt_text") { expect_updated_param("altText", "some alt_text") }
          it("contains the updated metadata") { expect_updated_param("metadata", metadata) }
          it("contains the updated credit") { expect_updated_param("title", "some credit") }
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: build_json_payload
          expect(response).to have_http_status(200)
        end
      end
    end

    describe "destroys a resource" do
      let(:path) { api_v1_resource_path(resource) }

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
