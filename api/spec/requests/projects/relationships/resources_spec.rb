# frozen_string_literal: true

RSpec.describe "Project Resources API", type: :request do
  let_it_be(:project, refind: true) { FactoryBot.create(:project) }

  describe "sends a list of project resources" do
    let(:path) { api_v1_project_relationships_resources_path(project) }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "creates a new project resource" do

    let(:path) { api_v1_project_relationships_resources_path(project) }
    let(:resource) { { attributes: {
      title: "A new hope",
      externalType: "vimeo",
      externalId: "abc123",
      sub_kind: "external_video"
    }, relationships: { project: { data: { type: "projects", id: project.id } } } } }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        it "has a 201 CREATED status code" do
          post path, headers: headers, params: build_json_payload(resource)
          expect(response).to have_http_status(201)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          post path, headers: headers, params: build_json_payload(resource)
          expect(response).to have_http_status(403)
        end
      end
    end
  end
end
