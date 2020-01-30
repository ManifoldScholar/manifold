require "swagger_helper"

RSpec.describe "Project Collections", type: :request do

  included_relationships = [
    :subjects,
    :collection_projects,
    :"collection_projects.project"
  ]

  path "/project_collections" do
    include_examples "an API create request",
                      model: ProjectCollection,
                      authorized_user: :admin,
                      included_relationships: included_relationships

    include_examples "an API index request",
                      model: ProjectCollection,
                      paginated: true,
                      included_relationships: included_relationships
  end

  path "/project_collections/{id}" do
    include_examples "an API show request",
                      model: ProjectCollection,
                      included_relationships: included_relationships

    include_examples "an API update request",
                      model: ProjectCollection,
                      authorized_user: :admin,
                      included_relationships: included_relationships

    include_examples "an API destroy request", model: ProjectCollection, authorized_user: :admin
  end

end
