require "swagger_helper"

RSpec.describe "Collaborators", type: :request do
  context "when relating to a project" do
    let(:resource) { FactoryBot.create(:collaborator) }
    let(:project_id) { resource.collaboratable_id }

    path "/projects/{project_id}/relationships/collaborators" do
      include_examples "an API index request",
                       parent: "project",
                       model: Collaborator,
                       url_parameters: [:project_id],
                       included_relationships: [:maker]
    end

    path "/projects/{project_id}/relationships/collaborators/{id}" do
      include_examples "an API show request",
                       parent: "project",
                       model: Collaborator,
                       url_parameters: [:project_id]
    end
  end
end
