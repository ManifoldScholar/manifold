# frozen_string_literal: true

RSpec.describe "Project Resources API", type: :request do
  let_it_be(:project, refind: true) { FactoryBot.create(:project) }

  describe "sends a list of project resources" do
    let(:path) { api_v1_project_relationships_resources_path(project) }
    before { get path }

    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "creates a new project resource" do
    let(:path) { api_v1_project_relationships_resources_path(project) }
    let(:resource) do
      { attributes: {
      title: "A new hope",
      externalType: "vimeo",
      externalId: "abc123",
      sub_kind: "external_video"
    }, relationships: { project: { data: { type: "projects", id: project.id } } } }
    end

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        it "has a 201 CREATED status code" do
          post path, headers: headers, params: build_json_payload(**resource)
          expect(response).to have_http_status(:created)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          post path, headers: headers, params: build_json_payload(**resource)
          expect(response).to have_http_status(:forbidden)
        end
      end
    end
  end
end
