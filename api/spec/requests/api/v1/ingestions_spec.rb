require "swagger_helper"

RSpec.describe "Ingestions", type: :request do
  path "/ingestions/{id}" do
    include_examples "an API update request", model: Ingestion, authorized_user: :admin
    include_examples "an API show request",
                     model: Ingestion,
                     authorized_user: :admin,
                     included_relationships: [:creator]
  end

  context "for a project" do
    let!(:ingestion) { FactoryBot.create(:ingestion) }
    let!(:project_id) { ingestion.project_id }

    path "/projects/{project_id}/relationships/ingestions" do
      include_examples "an API create request",
                       parent: "project",
                       model: Ingestion,
                       url_parameters: [:project_id],
                       authorized_user: :admin,
                       included_relationships: [:creator]
    end
  end
end
