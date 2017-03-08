require "rails_helper"

RSpec.describe "Project Events API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")
  let(:project) { FactoryGirl.create(:project) }

  describe "sends a list of project events" do
    let(:path) { api_v1_project_relationships_events_path(project) }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

end
