# frozen_string_literal: true

RSpec.describe "ProjectCollection CollectionProject API", type: :request do
  let_it_be(:project_collection, refind: true) { FactoryBot.create(:project_collection) }
  let_it_be(:project, refind: true) { FactoryBot.create(:project) }

  describe "creates a new CollectionProject for the ProjectCollection" do
    let(:path) { api_v1_project_collection_relationships_collection_projects_path(project_collection) }
    let(:collectionProject) { { attributes: {}, relationships: { project: { data: { type: "projects", id: project.id } } } } }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        it "has a 201 CREATED status code" do
          post path, headers: headers, params: build_json_payload(collectionProject)
          expect(response).to have_http_status(201)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      it "has a 403 FORBIDDEN status code" do
        post path, headers: headers, params: build_json_payload(collectionProject)
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "destroys the CollectionProject" do
    before(:each) do
      @collection_project = FactoryBot.create(:collection_project, project_collection: project_collection)
    end
    let(:path) { api_v1_project_collection_relationships_collection_project_path(project_collection, @collection_project) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
      end

      it "destroys a CollectionProject successfully" do
        expect do
          delete path, headers: headers
        end.to change { CollectionProject.count }.by(-1)
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      it "has a 403 FORBIDDEN status code" do
        delete path, headers: headers
        expect(response).to have_http_status(403)
      end
    end
  end
end
