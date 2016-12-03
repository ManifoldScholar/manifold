require "rails_helper"

RSpec.describe "Project Resources API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")
  let(:project) { FactoryGirl.create(:project) }

  describe "sends a list of project resources" do
    let(:path) { api_v1_project_relationships_resources_path(project) }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

end
