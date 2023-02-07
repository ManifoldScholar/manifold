require "swagger_helper"

RSpec.describe "Entitlements", type: :request do
  let(:project) { FactoryBot.create(:project) }
  let(:project_id) { project.id }
  let(:resource) { FactoryBot.create(:entitlement, :read_access, subject: project) }
  let(:id) { resource.id }

  let!(:target_user) { FactoryBot.create(:user) }
  let(:target_url) { target_user.to_gid.to_s }
  let(:subject_url) { project.to_entitlement_gid.to_s }
  let(:scoped_roles) { { read_access: true } }

  path "/entitlements" do
    include_examples "an API create request",
                     model: Entitlement,
                     authorized_user: :admin do
      let(:body) do
        {
          data: {
            attributes: {
              subject_url: subject_url,
              target_url: target_url,
              scoped_roles: scoped_roles
            }
          }
        }
      end
    end

    include_examples "an API index request", model: Entitlement, authorized_user: :admin
  end

  path "/entitlements/{id}" do
    include_examples "an API destroy request", model: Entitlement, authorized_user: :admin
    include_examples "an API show request", model: Entitlement, authorized_user: :admin
  end

  context "for a project" do
    path "/projects/{project_id}/relationships/entitlements" do
      include_examples "an API create request",
                       parent: "project",
                       model: Entitlement,
                       url_parameters: [:project_id],
                       authorized_user: :admin,
                       description: "Creates an entitlement to be associated with the project "\
                       "ID provided in the endpoint." do
        let(:body) do
          {
            data: {
              attributes: {
                target_url: target_url,
                scoped_roles: scoped_roles
              }
            }
          }
        end
      end

      include_examples "an API index request", parent: "project", model: Entitlement, url_parameters: [:project_id], authorized_user: :admin
    end
  end
end
