# frozen_string_literal: true

RSpec.describe "Project Uncollected Resorces API", type: :request do
  let(:project) { FactoryBot.create(:project) }

  describe "sends a list of uncollected project resources" do
    let(:path) { api_v1_project_relationships_uncollected_resources_path(project) }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end
end
