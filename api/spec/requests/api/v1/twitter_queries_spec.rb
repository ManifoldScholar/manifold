require "swagger_helper"

RSpec.describe "Twitter Queries", type: :request do
  path "/twitter_queries/{id}" do
    include_examples "an API destroy request", model: TwitterQuery, authorized_user: :admin
    include_examples "an API show request", model: TwitterQuery, authorized_user: :admin
    include_examples "an API update request", model: TwitterQuery, authorized_user: :admin
  end

  context "when belonging to a project" do
    let!(:resource) { FactoryBot.create(:twitter_query) }
    let!(:project_id) { resource.project_id }

    path "/projects/{project_id}/relationships/twitter_queries" do
      include_examples "an API create request",
                        model: TwitterQuery,
                        authorized_user: :admin,
                        tags: "Projects",
                        summary: "Creates a twitter query on a project",
                        url_parameters: [:project_id]

      include_examples "an API index request",
                        model: TwitterQuery,
                        authorized_user: :admin,
                        tags: "Projects",
                        summary: "Gets all twitter queries associated with a project",
                        url_parameters: [:project_id]
    end
  end
end
