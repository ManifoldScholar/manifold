require "swagger_helper"

RSpec.describe "Project Text Categories API", type: :request do
  let(:project) { FactoryBot.create(:project) }
  let(:project_id) { project.id }

  path "/projects/{project_id}/relationships/text_categories" do
    additional_parameters = [
      { name: :project_id, in: :path, type: :string }
    ]

    it_behaves_like "an API index request",
                    model: Category,
                    additional_parameters: additional_parameters,
                    resource_name: "text_category",
                    response_ref: "#/definitions/CategoryCollection"

    it_behaves_like "an API create request",
                    model: Category,
                    additional_parameters: additional_parameters,
                    resource_name: "text_category",
                    response_ref: "#/definitions/CategoryCreateRequest"
  end
end
