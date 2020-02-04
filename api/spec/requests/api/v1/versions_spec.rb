require "swagger_helper"

RSpec.describe "Versions", type: :request do
  let(:resource) { FactoryBot.create(:project) }
  let(:project_id) { resource.id }

  path "/projects/{project_id}/relationships/versions" do
    include_examples "an API index request",
                     model: Version,
                     parent: "project",
                     authorized_user: :admin,
                     paginated: true,
                     url_parameters: [:project_id]
  end
end
