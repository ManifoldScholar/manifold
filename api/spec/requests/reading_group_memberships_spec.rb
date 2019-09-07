require "rails_helper"

RSpec.describe "Reading Group Memberships API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")


  let(:reading_group) { FactoryBot.create(:reading_group) }

  describe "creates a reading_group" do
    let (:path) { api_v1_reading_group_memberships_path }
    let(:attributes) {
      {
      }
    }
    let(:relationships) {
      {
        user: { data: { id: reader.id } },
        reading_group: { data: { id: reading_group.id } },
      }
    }

    let(:valid_params) {
      json_payload(attributes: attributes, relationships: relationships)
    }

    it "has a 201 CREATED status code when the membership is for the authenticated user" do
      post path, headers: reader_headers, params: valid_params
      expect(response).to have_http_status(201)
    end

    it "has a 201 CREATED status code when the membership is for an admin user" do
      post path, headers: admin_headers, params: valid_params
      expect(response).to have_http_status(201)
    end

    it "has a 403 FORBIDDEN status code when the membership is NOT for the authenticated user" do
      post path, headers: another_reader_headers, params: valid_params
      expect(response).to have_http_status(403)
    end

  end

  describe "deletes a reading_group membership" do
    let(:reading_group_membership) { FactoryBot.create(:reading_group_membership, user: reader) }
    let(:path) { api_v1_reading_group_membership_path(reading_group_membership) }

    context "when the user is an admin" do

      let(:headers) { admin_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
      end
    end

    context "when the user belongs to the membership" do

      let(:headers) { reader_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
      end
    end

    context "when the user does not belong to the membership" do

      let(:headers) { another_reader_headers }

      it "has a 403 FORBIDDEN status code" do
        delete path, headers: headers
        expect(response).to have_http_status(403)
      end
    end


  end

end
