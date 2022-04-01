require "swagger_helper"

RSpec.describe "Text Categories", type: :request do
  describe "for a project" do
    let(:parent) { FactoryBot.create(:project) }
    let(:resource) { FactoryBot.create(:category, project: parent) }
    let(:project_id) { parent.id }

    path "/projects/{project_id}/relationships/text_categories" do
      include_examples "an API index request", parent: "project", model: Category, resource_name: "category", url_parameters: [:project_id]
      include_examples "an API create request", parent: "project", model: Category, resource_name: "category", url_parameters: [:project_id], authorized_user: :admin
    end
    path "/projects/{project_id}/relationships/text_categories/{id}" do
      include_examples "an API show request",
                       parent: "project",
                       model: Category,
                       resource_name: "text_category",
                       url_parameters: [:project_id],
                       description: "Authorization required when trying to access a draft project"
    end
  end
end
