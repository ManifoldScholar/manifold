# frozen_string_literal: true

RSpec.describe "ProjectExportations API", type: :request do
  let(:request_method) { raise "must set request method" }

  def expect_making_the_request(method: request_method, path: request_path, headers: admin_headers, **options)
    expect do
      __send__ method, path, headers: headers, **options
    end
  end

  describe "/api/v1/project_exportations" do
    let(:request_path) { api_v1_project_exportations_path }

    describe "GET" do
      let(:request_method) { :get }

      let!(:project_exportations) { FactoryBot.create_list :project_exportation, 2 }

      it "responds with the list of export targets" do
        expect_making_the_request.not_to raise_error

        expect(response).to be_successful
      end
    end

    describe "POST" do
      let(:request_method) { :post }
      let!(:project) { FactoryBot.create :project }
      let!(:export_target) { FactoryBot.create :export_target, :sftp_password }

      let(:valid_params) do
        build_json_payload(
          attributes: { project_id: project.id, export_target_id: export_target.id }
        )
      end

      it "creates an export target with valid params" do
        expect_making_the_request(params: valid_params).to change(ProjectExportation, :count).by(1).and have_enqueued_job(ProjectExportations::PerformJob)

        expect(response).to have_http_status :created
      end
    end
  end

  describe "/api/v1/project_exportations/:id" do
    let!(:project_exportation) { FactoryBot.create :project_exportation }

    let(:request_path) { api_v1_project_exportation_path(project_exportation.id) }

    describe "GET" do
      let(:request_method) { :get }

      it "responds with a single export target" do
        expect_making_the_request.not_to raise_error

        expect(response).to be_successful
      end
    end
  end
end
