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
                       parent: "project",
                       authorized_user: :admin,
                       url_parameters: [:project_id]

      include_examples "an API index request",
                       model: TwitterQuery,
                       parent: "project",
                       authorized_user: :admin,
                       url_parameters: [:project_id]
    end
  end

  context "when belonging to a twitter_query" do
    before(:all) do
      headers = {
        "Content-Type" => "application/json;charset=utf-8"
      }
      body = '{"statuses":[]}'
      stub_request(:get, /api.twitter.com/).to_return(status: 200, body: body, headers: headers)
    end

    let!(:resource) { FactoryBot.create(:twitter_query) }
    let!(:twitter_query_id) { resource.id }
    path "/twitter_queries/{twitter_query_id}/relationships/fetch" do
      include_examples "an API create request",
                       model: TwitterQuery,
                       parent: "twitter query",
                       description: "In order to run this query successfully, "\
                       "twitter credentials must be set in the settings for this "\
                       "manifold instance. Please look at the /settings routes "\
                       "for more information on how to set twitter credentials.",
                       authorized_user: :admin,
                       url_parameters: [:twitter_query_id]
    end
  end
end
