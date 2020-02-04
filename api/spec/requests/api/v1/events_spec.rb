require "swagger_helper"

RSpec.describe "Events", type: :request do
  let(:project) { FactoryBot.create(:project) }
  let(:resource) { FactoryBot.create(:event, project: project) }
  let(:project_id) { project.id }
  let(:id) { resource.id }

  path "/events/{id}" do
    include_examples "an API destroy request", model: Event, authorized_user: :admin
  end

  context "for a project" do
    path "/projects/{project_id}/relationships/events" do
      include_examples "an API index request", parent: "project", model: Event, url_parameters: [:project_id]
    end
  end
end
