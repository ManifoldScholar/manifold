# frozen_string_literal: true

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

  it "calls stuff" do
    FactoryBot.create(:event, project: project)
    get "/api/v1/projects/#{project.id}/relationships/events", headers: { HTTP_ACCEPT: "application/json" }

    expect(response).to have_http_status(:ok)
  end
end
