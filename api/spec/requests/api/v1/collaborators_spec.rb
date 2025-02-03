require "swagger_helper"

RSpec.describe "Collaborators", type: :request do
  context "GET /api/v1/collaborators/roles" do
    it "returns a 200 response" do
      get roles_api_v1_collaborators_path
      expect(response).to have_http_status :ok
    end
  end

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

  context "when relating to a text" do
    let(:text) { FactoryBot.create(:text) }
    let(:resource) { FactoryBot.create(:collaborator, collaboratable: text) }
    let(:text_id) { text.id }

    path "/texts/{text_id}/relationships/collaborators" do
      include_examples "an API index request",
                       parent: "text",
                       model: Collaborator,
                       url_parameters: [:text_id],
                       included_relationships: [:maker]
    end

    path "/texts/{text_id}/relationships/collaborators/{id}" do
      include_examples "an API show request",
                       parent: "text",
                       model: Collaborator,
                       url_parameters: [:text_id]
    end
  end
end
