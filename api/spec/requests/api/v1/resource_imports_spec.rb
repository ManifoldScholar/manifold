require "swagger_helper"

RSpec.describe "Resource Imports", type: :request do
  let(:factory) { :resource_import }
  let(:resource) { FactoryBot.create(:resource_import) }
  let(:project_id) { resource.project_id }

  path "/projects/{project_id}/relationships/resource_imports" do
    include_examples "an API create request",
                     parent: "project",
                     model: ResourceImport,
                     url_parameters: [:project_id],
                     authorized_user: :admin
  end

  path "/projects/{project_id}/relationships/resource_imports/{id}" do
    include_examples "an API show request",
                     parent: "project",
                     model: ResourceImport,
                     url_parameters: [:project_id],
                     authorized_user: :admin

    include_examples "an API update request",
                     parent: "project",
                     model: ResourceImport,
                     url_parameters: [:project_id],
                     authorized_user: :admin
  end
end
