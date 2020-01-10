require "swagger_helper"

RSpec.describe "Permissions", type: :request do

  let!(:project) { FactoryBot.create(:project) }
  let!(:project_id) { project.id }

  path "/projects/{project_id}/relationships/permissions" do
    include_examples "an API index request",
                      model: Permission,
                      url_parameters: [:project_id],
                      tags: "Projects",
                      authorized_user: :admin

    include_examples "an API create request",
                      model: Permission,
                      authorized_user: :admin,
                      tags: "Projects",
                      included_relationships: [:user],
                      url_parameters: [:project_id] do
                        let(:body) {
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
                          					id: "#{admin.id}",
                          					type: "users"
                          				}
                          			}
                          		}
                          	}
                          }
                        }
                      end
  end

  let!(:resource) do
    admin.add_role Role::ROLE_PROJECT_AUTHOR, project
    Permission.fetch(project, admin)
  end

  path "/projects/{project_id}/relationships/permissions/{id}" do
    include_examples "an API show request",
                      model: Permission,
                      authorized_user: :admin,
                      tags: "Projects",
                      url_parameters: [:project_id]

    include_examples "an API update request",
                      model: Permission,
                      authorized_user: :admin,
                      tags: "Projects",
                      included_relationships: [:user],
                      url_parameters: [:project_id]

    include_examples "an API destroy request",
                      model: Permission,
                      authorized_user: :admin,
                      tags: "Projects",
                      url_parameters: [:project_id]
  end
end
