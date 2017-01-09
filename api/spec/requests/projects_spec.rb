require "rails_helper"

RSpec.describe "Projects API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:project) { FactoryGirl.create(:project) }

  describe "responds with a list of projects" do
    before(:each) { get api_v1_projects_path, headers: reader_headers }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "sends a single project" do
    let(:path) { api_v1_project_path(project) }

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

  describe "updates a project" do

    let(:path) { api_v1_project_path(project) }
    let(:metadata) {
      {
        "isbn" => "1234",
        "publisher" => "Someone",
        "placeOfPublication" => "Somewhere",
        "doi" => "1234",
        "series" => "The Hardy Boys"
      }
    }
    context "when the user is an admin" do

      let(:headers) { admin_headers }

      describe "its creator association" do

        let(:john) { FactoryGirl.create(:maker, first_name: "John") }
        let(:jim) { FactoryGirl.create(:maker, first_name: "Jim") }
        let(:jenny) { FactoryGirl.create(:maker, first_name: "Jenny") }

        it("can be replaced") do
          project.creators << jenny
          params = json_payload(relationships: { creators: { data: [
            { type: "makers", id: john.id },
            { type: "makers", id: jim.id }
          ]}})
          patch path, headers: headers, params: params
          expect(project.creators.pluck(:id)).to contain_exactly(jim.id, john.id)
        end
      end

      describe "the response" do
        context "body" do
          it("contains the updated title") { expect_updated_param("title", "a title") }
          it("contains the updated subtitle") { expect_updated_param("subtitle", "a subtitle") }
          it("contains the updated featured boolean value") { expect_updated_param("featured", "true", true ) }
          it("contains the updated hashtag") { expect_updated_param("hashtag", "the_hashtag" ) }
          it("contains the updated description") { expect_updated_param("description", "the description") }
          it("contains the updated purchase price") { expect_updated_param("purchasePriceMoney", "$7.95", 7.95, "purchasePrice") }
          context "contains the updated purchase price" do
            it("when the currency sign is not present") { expect_updated_param("purchasePriceMoney", "2.50", "$2.50") }
            it("when the currency sign is present") { expect_updated_param("purchasePriceMoney", "$2.50", "$2.50") }
          end
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: json_payload()
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is a reader" do

      let(:headers) { reader_headers }

      describe "the response" do
        it "has a 403 forbidden status code" do
          patch path, headers: headers, params: json_payload()
          expect(response).to have_http_status(403)
        end
      end
    end

  end
end
