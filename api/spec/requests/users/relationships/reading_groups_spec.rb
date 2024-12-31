# frozen_string_literal: true

RSpec.describe "User Reading Groups API", type: :request do
  context "when fetching reading groups" do
    let_it_be(:user) { FactoryBot.create(:user) }
    let(:filter) do { page: { number: 1, size: 10 } } end
    let(:params) do { filter: filter } end
    let(:path) { api_v1_user_relationships_reading_groups_path(user) }

    let_it_be(:reading_group_memberships) { FactoryBot.create_list(:reading_group_membership, 4, user: user) }

    it "renders successfully" do
      expect do
        get path, headers: admin_headers, params: params
      end.to execute_safely

      expect(response).to have_http_status(200)
    end
  end
end
