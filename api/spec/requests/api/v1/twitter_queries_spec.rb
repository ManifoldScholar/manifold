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
                        summary: "Returns all twitter queries associated with a project",
                        url_parameters: [:project_id]
    end

  end

  context "when belonging to a twitter_query" do
    let!(:resource) { FactoryBot.create(:twitter_query) }
    let!(:twitter_query_id) { resource.id }
    path "/twitter_queries/{twitter_query_id}/relationships/fetch" do
      include_examples "an API create request",
                        model: TwitterQuery,
                        summary: "Returns all tweets that match the query in the TwitterQuery",
                        description: "In order to run this query successfully, "\
                        "twitter credentials must be set in the settings for this "\
                        "manifold instance. Please look at the /settings routes "\
                        "for more information on how to set twitter credentials.",
                        authorized_user: :admin,
                        url_parameters: [:twitter_query_id]
    end
  end
end
