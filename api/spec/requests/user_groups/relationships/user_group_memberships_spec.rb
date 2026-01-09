# frozen_string_literal: true

RSpec.describe "User Group Memberships API", type: :request do
  let!(:user_group) { FactoryBot.create(:user_group) }
  let!(:user) { FactoryBot.create(:user) }
  let!(:user_group_membership) { FactoryBot.creat(:user_group_membership) }

  base_path = "/api/v1/user_groups/:user_group_id/relationships/user_group_memberships"

  let(:path) { api_v1_user_group_relationships_user_group_memberships(user_group_id: user_group.id) }
  let(:membership_path) { api_v1_user_group_relationships_user_group_membership(user_group_id: user_group.id, id: user_group_membership.id) }

  let(:params) do
    {
      data: {
        type: "UserGroupMemberships",
        attributes: {},
        relationships: {
          user: { data: { id: user.id } }
        }
      }
    }.to_json
  end

  describe "POST #{base_path}" do
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "creates a user group membership" do
        expect do
          post path, headers: headers, params: params
        end.to change(UserGroupMembership, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      it "it does not create a user group membership" do
        expect do
          post path, headers: headers, params: params
        end.to keep_the_same(UserGroupMembership, :count)
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "DELETE #{base_path}/:id" do
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "deletes a user group membership" do
        expect do
          delete membership_path, headers: headers
        end.to change(UserGroupMembership, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      it "it does not delete a user group membership" do
        expect do
          post path, headers: headers, params: params
        end.to keep_the_same(UserGroupMembership, :count)
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
