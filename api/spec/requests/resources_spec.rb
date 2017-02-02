require "rails_helper"

RSpec.describe "Resources API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:resource) { FactoryGirl.create(:resource) }

  describe "sends a resource" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_resources_path
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "updates a resource" do

    let(:path) { api_v1_resource_path(resource) }

    context "when the user is an admin" do

      let(:headers) { admin_headers }

      describe "the response" do
        context "body" do
          it("contains the updated title") { expect_updated_param("title", "some title") }
          it("contains the updated caption") { expect_updated_param("caption", "some caption") }
          it("contains the updated description") { expect_updated_param("description", "some description") }
          it("contains the updated keywords") { expect_updated_param("keywords", "some keywords") }
          it("contains the updated alt_text") { expect_updated_param("altText", "some alt_text") }
          it("contains the updated copyright_status") { expect_updated_param("copyrightStatus", "some copyright_status") }
          it("contains the updated copyright_holder") { expect_updated_param("copyrightHolder", "some copyright_holder") }
          it("contains the updated credit") { expect_updated_param("title", "some credit") }
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: json_payload()
          expect(response).to have_http_status(200)
        end
      end
    end
  end

end
