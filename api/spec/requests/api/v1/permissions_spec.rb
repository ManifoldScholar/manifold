require "swagger_helper"

RSpec.describe "Permissions", type: :request do
  let!(:project) { FactoryBot.create(:project) }
  let!(:project_id) { project.id }

  path "/projects/{project_id}/relationships/permissions" do
    include_examples "an API index request",
                     parent: "project",
                     model: Permission,
                     url_parameters: [:project_id],
                     authorized_user: :admin

    include_examples "an API create request",
                     parent: "project",
                     model: Permission,
                     authorized_user: :admin,
                     included_relationships: [:user],
                     url_parameters: [:project_id] do
      let(:body) do
        {
          data: {
            attributes: {
              roleNames: [
                "project_editor"
              ]
            },
            relationships: {
              user: {
                data: {
                  id: admin.id.to_s,
                  type: "users"
                }
              }
            }
          }
        }
      end
    end
  end

  let!(:resource) do
    admin.add_role :project_author, project
    Permission.fetch(project, admin)
  end

  path "/projects/{project_id}/relationships/permissions/{id}" do
    include_examples "an API show request",
                     parent: "project",
                     model: Permission,
                     authorized_user: :admin,
                     url_parameters: [:project_id]

    include_examples "an API update request",
                     parent: "project",
                     model: Permission,
                     authorized_user: :admin,
                     included_relationships: [:user],
                     url_parameters: [:project_id]

    include_examples "an API destroy request",
                     parent: "project",
                     model: Permission,
                     authorized_user: :admin,
                     url_parameters: [:project_id]
  end
end
