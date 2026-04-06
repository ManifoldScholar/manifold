# frozen_string_literal: true

RSpec.describe "User Annotations API", type: :request do
  context "when fetching annotations" do
    let_it_be(:user) { FactoryBot.create(:user) }
    let(:filter) do
      { page: { number: 1, size: 10 } }
    end
    let(:params) do
      { filter: filter }
    end
    let(:path) { api_v1_user_relationships_annotations_path(user) }

    let_it_be(:annotations) do
      FactoryBot.create_list(:annotation, 3, creator: user)
    end

    it "renders successfully" do
      expect do
        get path, headers: admin_headers, params: params
      end.to execute_safely

      expect(response).to have_http_status(:ok)
    end
  end
end
