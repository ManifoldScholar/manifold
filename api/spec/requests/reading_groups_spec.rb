require "rails_helper"

RSpec.describe "Reading Groups API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:reading_group) { FactoryBot.create(:reading_group, creator: reader) }

  describe "responds with a list of reading groups" do

    describe "the response" do

      before(:each) { get api_v1_reading_groups_path, headers: headers }

      context "when the user is a reading group owner" do
        let(:headers) { reader_headers }
        it "has a 403 status code" do
          expect(response).to have_http_status(403)
        end
      end

      context "when the user is an admin" do
        let(:headers) { admin_headers }
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  describe "sends a reading group" do
    describe "the response" do

      context "when the id is provided" do
        before(:each) { get api_v1_reading_group_path(reading_group), headers: headers }
        context "when the user is the reading group owner" do

          let(:headers) { reader_headers }
          it "has a 200 status code" do
            expect(response).to have_http_status(200)
          end
        end

        context "when the user is not in the reading group" do

          let(:headers) { another_reader_headers }
          it "has a 403 status code" do
            expect(response).to have_http_status(403)
          end
        end

        context "when the user is an admin" do

          let(:headers) { admin_headers }
          it "has a 200 status code" do
            expect(response).to have_http_status(200)
          end
        end

      end

      context "when the invitation code is provided" do

        before(:each) { get api_v1_reading_group_path(reading_group.invitation_code), headers: headers }

        context "when the user is not in the reading group" do

          let(:headers) { another_reader_headers }
          it "has a 200 status code" do
            expect(response).to have_http_status(200)
          end
        end
      end

    end
  end

  describe "updates a reading group" do

    let(:path) { api_v1_reading_group_path(reading_group) }

    context "when the user is the reading group owner" do

      let(:headers) { reader_headers }
      let(:metadata) {
        {
          name: "This is a new name"
        }
      }

      describe "the response" do
        context "body" do
          it("contains the updated name") { expect_updated_param("name", "This is the new name") }
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: build_json_payload()
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is not the reading group owner" do

      let(:headers) { another_reader_headers }
      let(:metadata) {{ name: "This is a new name" }}

      describe "the response" do
        it "has a 403 status code" do
          patch path, headers: headers, params: build_json_payload()
          expect(response).to have_http_status(403)
        end
      end
    end

    context "when the user is an admin" do

      let(:headers) { admin_headers }
      let(:metadata) {{ name: "This is a new name" }}

      describe "the response" do
        it "has a 200 status code" do
          patch path, headers: headers, params: build_json_payload()
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  describe "creates a reading_group" do
    let (:path) { api_v1_reading_groups_path }
    let(:attributes) {
      {
        name: "My Reading Group"
      }
    }
    let(:valid_params) {
      build_json_payload(attributes: attributes)
    }

    it "has a 201 CREATED status code" do
      post path, headers: reader_headers, params: valid_params
      expect(response).to have_http_status(201)
    end
  end

  describe "deletes a reading_group" do
    let(:path) { api_v1_reading_group_path(reading_group) }

    context "when the user is an admin" do

      let(:headers) { admin_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
      end
    end

    context "when the user is the creator" do

      let(:headers) { reader_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
      end
    end

    context "when the user is the not the creator" do

      let(:headers) { another_reader_headers }

      it "has a 403 FORBIDDEN status code" do
        delete path, headers: headers
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "cloning a reading group" do
    include_context "simple auth request"

    let!(:reading_group_creator) { FactoryBot.create :user }

    let!(:reading_group) { FactoryBot.create :reading_group, creator: reading_group_creator }

    def expect_request
      expect do
        post clone_api_v1_reading_group_path(reading_group), headers: auth_headers
      end
    end

    shared_examples_for "able to clone" do
      it "is allowed" do
        expect_request.to change(ReadingGroup, :count).by(1)

        expect(response).to be_successful
      end
    end

    shared_examples_for "forbidden to clone" do
      it "is forbidden" do
        expect_request.to keep_the_same(ReadingGroup, :count)

        expect(response).to have_http_status 403
      end
    end

    context "as an unaffiliated user" do
      include_examples "forbidden to clone"
    end

    context "as a member" do
      let!(:reading_group_membership) do
        FactoryBot.create :reading_group_membership, user: current_user, reading_group: reading_group
      end

      include_examples "forbidden to clone"
    end

    context "as a moderator" do
      let!(:reading_group_membership) do
        FactoryBot.create :reading_group_membership, :moderator, user: current_user, reading_group: reading_group
      end

      include_examples "able to clone"
    end

    context "as the creator" do
      let(:reading_group_creator) { current_user }

      include_examples "able to clone"
    end

    context "as an admin" do
      let(:current_user) { FactoryBot.create :user, :admin }

      include_examples "able to clone"
    end
  end
end
