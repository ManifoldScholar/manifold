# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Collection Project", type: :request do
  let(:resource) { FactoryBot.create(:collection_project) }
  let(:project_collection_id) { resource.project_collection_id }
  let(:project_id) { FactoryBot.create(:project).id }

  path "/project_collections/{project_collection_id}/relationships/collection_projects" do
    it_behaves_like "an API index request",
                     parent: "project collection",
                     model: CollectionProject,
                     url_parameters: [:project_collection_id],
                     included_relationships: [:project]

    it_behaves_like "an API create request",
                     parent: "project collection",
                     model: CollectionProject,
                     url_parameters: [:project_collection_id],
                     authorized_user: :admin,
                     exclude: %w(401) do
      let(:body) do
        {
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
        }
      end
    end
  end

  path "/project_collections/{project_collection_id}/relationships/collection_projects/{id}" do
    it_behaves_like "an API update request",
                     model: CollectionProject,
                     parent: "project collection",
                     tags: "Project Collections",
                     url_parameters: [:project_collection_id],
                     authorized_user: :admin,
                     included_relationships: [:creator]

    it_behaves_like "an API destroy request",
                     model: CollectionProject,
                     parent: "project collection",
                     tags: "Project Collections",
                     url_parameters: [:project_collection_id],
                     authorized_user: :admin,
                     included_relationships: [:creator]
  end
end
