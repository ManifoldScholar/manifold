# frozen_string_literal: true

RSpec.describe "Project Collections API", type: :request do
  let(:project_collection) do
    pc = FactoryBot.create(:project_collection)
    pc.projects << FactoryBot.create(:project)
    pc.projects << FactoryBot.create(:project, draft: true)
    pc
  end

  describe "sends a list of collections" do
    describe "the response" do
      it "has a 200 status code" do
        get api_v1_project_collections_path
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "sends a single project collection" do
    let(:path) { api_v1_project_collection_path(project_collection) }

    context "when the user is an reader" do
      before(:each) { get path, headers: reader_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end

        it "does not include draft projects" do
          included = JSON.parse(response.body).dig("included").select { |record| record["type"] == "projects" }
          expect(included.length).to eq 1
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { get path, headers: admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end

        it "does include draft projects" do
          included = JSON.parse(response.body).dig("included").select { |record| record["type"] == "projects" }
          expect(included.length).to eq 2
        end
      end
    end
  end

  describe "creates a collection" do
    let (:path) { api_v1_project_collections_path }
    let(:subject) { FactoryBot.create(:subject) }
    let(:attributes) do
      {
        title: "Project Collection",
        icon: "some-icon",
        smart: true
      }
    end
    let(:relationships) do
      {
        subjects: { data: [{ type: "subjects", id: subject.id }] }
      }
    end
    let(:valid_params) do
      build_json_payload(attributes: attributes, relationships: relationships)
    end

    it "has a 201 CREATED status code" do
      post path, headers: admin_headers, params: valid_params
      expect(response).to have_http_status(201)
    end
  end

  describe "updates a collection" do
    let(:path) { api_v1_project_collection_path(project_collection) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        context "body" do
          it("contains the updated title") { expect_updated_param("title", "some title") }
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: build_json_payload
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  describe "destroys a collection" do
    let(:path) { api_v1_project_collection_path(project_collection) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
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
