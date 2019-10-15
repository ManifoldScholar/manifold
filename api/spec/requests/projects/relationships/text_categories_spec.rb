require "swagger_helper"

RSpec.describe "Project Text Categories API", type: :request do
  let(:project) { FactoryBot.create(:project) }
  let(:project_id) { project.id }

  path "/projects/{project_id}/relationships/text_categories" do
    params = {
      project: { name: :project_id, in: :path, type: :string },
      create: { name: :create, in: :body, schema: "#/definitions/CategoryRequestCreate" }
    }

    include_examples "an API index request",
                     model: Category,
                     parameters: params.fetch_values(:project),
                     resource_name: "text_category",
                     response_ref: "#/definitions/CategoryResponses"

    it_behaves_like "an API create request",
                    model: Category,
                    parameters: params.fetch_values(:project, :create),
                    resource_name: "text_category",
                    response_ref: "#/definitions/CategoryRequestCreate"
  end
end
