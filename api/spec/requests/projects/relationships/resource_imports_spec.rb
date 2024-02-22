# frozen_string_literal: true

RSpec.describe "Resource Import API", type: :request do
  let_it_be(:csv_path) do
    Rails.root.join("spec", "data", "resource_import", "resources.csv")
  end

  let(:attributes) do
    {
      source: "attached_data",
      data: file_param(csv_path, "text/csv", "resources.csv")
    }
  end

  let(:valid_params) do
    build_json_payload(attributes: attributes)
  end

  let_it_be(:project, refind: true) { FactoryBot.create(:project) }
  let_it_be(:resource_import, refind: true) { FactoryBot.create(:resource_import, project: project) }

  describe "creates a resource_import model" do

    let(:path) { api_v1_project_relationships_resource_imports_path(project) }
    let(:api_response) { JSON.parse(response.body) }

    before(:each) do
      post path, headers: admin_headers, params: valid_params
    end

    it "sets the creator correctly" do
      resource_import = ResourceImport.find api_response["data"]["id"]
      expect(resource_import.creator.id).to eq(admin.id)
    end
  end

  describe "updates a resource_import model" do

    before(:each) do
      @resource_import = FactoryBot.create(:resource_import, project: project)
    end

    let(:path) { api_v1_project_relationships_resource_import_path(project, @resource_import) }

    it "has a 200 SUCCESS status code" do
      put path, headers: admin_headers, params: valid_params
      expect(response).to have_http_status(200)
    end

    it "changes the state of the import model" do
      valid_params = build_json_payload(attributes: { state: "parsing" })
      put path, headers: admin_headers, params: valid_params
      @resource_import.reload
      expect(@resource_import.state_machine.in_state?(:parsed)).to be true
    end
  end

  describe "sends a single resource import model" do
    before(:each) do
      @resource_import = FactoryBot.create(:resource_import, project: project)
    end

    let(:path) { api_v1_project_relationships_resource_import_path(project, @resource_import) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          get path, headers: headers
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          get path, headers: headers
          expect(response).to have_http_status(403)
        end
      end
    end
  end
end
