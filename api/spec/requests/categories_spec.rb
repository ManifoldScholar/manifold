# frozen_string_literal: true

RSpec.describe "Categories API", type: :request do
  describe "sends a category" do
    let(:category) { FactoryBot.create(:category, role: Category::ROLE_TEXT) }

    describe "the response" do
      it "has a 200 status code" do
        get api_v1_category_path(category)
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "updates a text" do
    it_should_behave_like "orderable api requests" do
      let(:path) { "api_v1_category_path" }
      let!(:object_a) { FactoryBot.create(:category, position: 1) }
      let!(:object_b) { FactoryBot.create(:category, position: 2, project: object_a.project) }
    end
  end
end
