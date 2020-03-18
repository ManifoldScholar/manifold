require "swagger_helper"

RSpec.describe "Project Exportations", type: :request do
  let!(:project) { FactoryBot.create(:project) }
  let!(:project_id) { project.id }
  let!(:export_target) { FactoryBot.create(:export_target) }

  path "/project_exportations" do
    include_examples "an API index request", model: ProjectExportation
    include_examples "an API create request", model: ProjectExportation, authorized_user: :admin do
      let(:body) do
        {
          data: {
            attributes: {
              project_id: project_id,
              export_target_id: export_target.id
            }
          }
        }
      end
    end
  end

  path "/project_exportations/{id}" do
    include_examples "an API show request", model: ProjectExportation
  end

  path "/projects/{project_id}/relationships/project_exportations" do
    include_examples "an API index request", model: ProjectExportation, url_parameters: [:project_id]
  end
end
