require "swagger_helper"

RSpec.describe "Collection Project", type: :request do
  let(:resource) { FactoryBot.create(:collection_project) }
  let(:project_collection_id) { resource.project_collection_id }
  let(:project_id) { FactoryBot.create(:project).id }

  path "/project_collections/{project_collection_id}/relationships/collection_projects" do
    include_examples "an API index request",
                      model: CollectionProject,
                      tags: "Project Collections",
                      summary: "Returns all Collection Projects for a Project Collection",
                      url_parameters: [:project_collection_id],
                      included_relationships: [:project]

    include_examples "an API create request",
                      model: CollectionProject,
                      tags: "Project Collections",
                      summary: "Creates a Collection Project on a Project Collection",
                      url_parameters: [:project_collection_id],
                      authorized_user: :admin,
                      exclude: %w(401) do
                        let(:body) {{
                        	data: {
                        		attributes: {
                        			position: 1
                        		},
                        		relationships: {
                        			project: {
                        				data: {
                        					id: project_id,
                        					type: "projects"
                        				}
                        			}
                        		}
                        	}
                        }}


                      end

  end

  path "/project_collections/{project_collection_id}/relationships/collection_projects/{id}" do
    include_examples "an API update request",
                    model: CollectionProject,
                    tags: "Project Collections",
                    summary: "Updates a Collection Project on a Project Collection",
                    url_parameters: [:project_collection_id],
                    authorized_user: :admin,
                    included_relationships: [:creator]

    include_examples "an API destroy request",
                    model: CollectionProject,
                    tags: "Project Collections",
                    summary: "Removes a Collection Project on a Project Collection",
                    url_parameters: [:project_collection_id],
                    authorized_user: :admin,
                    included_relationships: [:creator]
  end
end
