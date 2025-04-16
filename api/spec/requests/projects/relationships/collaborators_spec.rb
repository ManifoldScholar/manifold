# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Project Collaborators API", type: :request do
  let(:collaborator) do
    FactoryBot.create(:collaborator, maker: maker, collaboratable: project)
  end
  let(:maker) { FactoryBot.create(:maker) }
  let(:project) { FactoryBot.create(:project) }
  it_behaves_like "a controller handling flattened collaborators", :project

  describe "sends project collaborators" do
    let(:path) { api_v1_project_relationships_collaborators_path(project) }
    before { get path }

    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "sends a project collaborator" do
    let(:path) { api_v1_project_relationships_collaborator_path(project, collaborator) }
    before { get path }

    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(:ok)
      end
    end
  end
end
