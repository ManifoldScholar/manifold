require "swagger_helper"

RSpec.describe "Resource Imports", type: :request do

  let(:resource) { FactoryBot.create(:resource_import) }
  let(:project_id) { resource.project_id }

  path "/projects/{project_id}/relationships/resource_imports" do
    include_examples "an API create request",
                      model: ResourceImport,
                      url_parameters: [:project_id],
                      authorized_user: :admin
  end

  path "/projects/{project_id}/relationships/resource_imports/{id}" do
    include_examples "an API show request",
                      model: ResourceImport,
                      url_parameters: [:project_id],
                      authorized_user: :admin,
                      focus: true

    include_examples "an API update request",
                      model: ResourceImport,
                      url_parameters: [:project_id],
                      authorized_user: :admin
  end
end
