# frozen_string_literal: true

RSpec.describe "Reading Group Memberships API", type: :request do
  let(:reading_group) { FactoryBot.create(:reading_group) }

  describe "creates a reading_group" do
    let (:path) { api_v1_reading_group_memberships_path }

    let(:attributes) do
      {}
    end

    let(:relationships) do
      {
        user: { data: { id: reader.id } },
        reading_group: { data: { id: reading_group.id } },
      }
    end

    let(:valid_params) do
      build_json_payload(attributes: attributes, relationships: relationships)
    end

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

  describe "archiving a reading group membership" do
    include_context "simple auth request"

    let!(:reading_group_creator) { FactoryBot.create :user }
    let!(:member) { current_user }

    let!(:reading_group) { FactoryBot.create :reading_group, creator: reading_group_creator }

    let!(:reading_group_membership) { FactoryBot.create :reading_group_membership, user: member, reading_group: reading_group }

    def expect_request
      expect do
        post archive_api_v1_reading_group_membership_path(reading_group_membership), headers: auth_headers
      end
    end

    context "when the membership is active" do
      it "succeeds" do
        expect_request.to change { reading_group_membership.reload.archived? }.from(false).to(true)

        expect(response).to be_successful
      end

      context "as a different user" do
        let(:member) { FactoryBot.create :user }

        it "fails" do
          expect_request.to keep_the_same { reading_group_membership.reload.archived? }

          expect(response).to be_forbidden
        end
      end
    end

    context "when the membership is already archived" do
      before(:each) do
        reading_group_membership.archive!
      end

      it "fails" do
        expect_request.to keep_the_same { reading_group_membership.reload.archived? }

        expect(response).to have_http_status 422
      end
    end
  end

  describe "(re)activating a reading group membership" do
    include_context "simple auth request"

    let!(:reading_group_creator) { FactoryBot.create :user }
    let!(:member) { current_user }

    let!(:reading_group) { FactoryBot.create :reading_group, creator: reading_group_creator }

    let!(:reading_group_membership) { FactoryBot.create :reading_group_membership, user: member, reading_group: reading_group }

    def expect_request
      expect do
        post activate_api_v1_reading_group_membership_path(reading_group_membership), headers: auth_headers
      end
    end

    context "when the membership is archived" do
      before(:each) do
        reading_group_membership.archive!
      end

      it "succeeds" do
        expect_request.to change { reading_group_membership.reload.active? }.from(false).to(true)

        expect(response).to be_successful
      end

      context "as a different user" do
        let(:member) { FactoryBot.create :user }

        it "fails" do
          expect_request.to keep_the_same { reading_group_membership.reload.active? }

          expect(response).to be_forbidden
        end
      end
    end

    context "when the membership is already active" do
      it "fails" do
        expect_request.to keep_the_same { reading_group_membership.reload.active? }

        expect(response).to have_http_status 422
      end
    end
  end
end
