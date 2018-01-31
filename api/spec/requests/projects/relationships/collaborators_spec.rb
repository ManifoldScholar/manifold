require "rails_helper"

RSpec.describe "Project Collaborators API", type: :request do

  let(:project) { FactoryBot.create(:project) }
  let(:maker) { FactoryBot.create(:maker) }
  let(:collaborator) {
    FactoryBot.create(:collaborator, maker: maker, collaboratable: project)
  }

  describe "sends project collaborators" do
    let(:path) { api_v1_project_relationships_collaborators_path(project) }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "sends a project collaborator" do
    let(:path) { api_v1_project_relationships_collaborator_path(project, collaborator) }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

end
