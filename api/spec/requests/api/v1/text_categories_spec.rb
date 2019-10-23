require "swagger_helper"

RSpec.describe "Text Categories", type: :request do
  describe "for a project" do
    let(:parent) { FactoryBot.create(:project) }
    let(:resource) { FactoryBot.create(:category, project: parent) }
    let(:project_id) { parent.id }

    path "/projects/{project_id}/relationships/text_categories" do
      include_examples "an API index request", model: Category, resource_name: "text_category", tags: "Project Text Categories", url_parameters: [:project_id]
      include_examples "an API create request", model: Category, resource_name: "text_category", tags: "Project Text Categories", url_parameters: [:project_id], auth_type: :admin
    end
    path "/projects/{project_id}/relationships/text_categories/{id}" do
      include_examples "an API show request", model: Category, resource_name: "text_category", tags: "Project Text Categories", url_parameters: [:project_id]
    end
  end
end
