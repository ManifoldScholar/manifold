require "swagger_helper"

RSpec.describe "Project Collections API", type: :request do
  request_create_schema = { '$ref' => '#/definitions/ProjectCollectionRequestCreate' }
  request_update_schema = { '$ref' => '#/definitions/ProjectCollectionRequestUpdate' }
  response_schema = { '$ref' => '#/definitions/ProjectCollectionResponse' }
  response_schema_full = { '$ref' => '#/definitions/ProjectCollectionResponseFull' }


  include_context("authenticated request")
  include_context("param helpers")

  let(:project_collection) do
    pc = FactoryBot.create(:project_collection)
    pc.projects << FactoryBot.create(:project)
    pc.projects << FactoryBot.create(:project, draft: true)
    pc
  end

  path "/project_collections" do
    get I18n.t('swagger.get.all.description', type: 'project collections') do
      produces 'application/json'
      tags 'Project Collections'

      response '200', I18n.t('swagger.get.all.200', type: 'project collections') do
        schema response_schema
        run_test!
      end
    end

    post I18n.t('swagger.post.description', type: 'project collections') do
      consumes 'application/json'
      produces 'application/json'

      parameter name: :project_collection_attributes, in: :body, schema: request_create_schema
      security [ apiKey: [] ]
      tags 'Project Collections'

      response '201', I18n.t('swagger.post.201', type: 'project collections') do
        let(:Authorization) { admin_auth }
        let(:project_collection_attributes) {{ data: { attributes: FactoryBot.attributes_for(:project_collection) }}}

        schema response_schema
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: 'project collections') do
        let(:Authorization) { reader_auth }
        let(:project_collection_attributes) {{ data: { attributes: FactoryBot.attributes_for(:project_collection) }}}
        run_test!
      end
    end
  end

  path "/project_collections/{id}" do
    accessor_attribute = 'ID'
    let(:model_id) { project_collection[:id] }

    get I18n.t('swagger.get.one.description', type: 'project collection', attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      produces 'application/json'
      tags 'Project Collections'

      response '200', I18n.t('swagger.get.one.200', type: 'project collection', attribute: accessor_attribute) do
        let(:id) { model_id }
        schema response_schema_full
        run_test!
      end

      response '404', I18n.t('swagger.not_found') do
        let(:id) { 'a' }
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: 'project collection', attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { model_id }
      parameter name: :project_collection_attributes, in: :body, schema: request_update_schema
      let(:project_collection_attributes) {{ data: { attributes: FactoryBot.attributes_for(:project_collection) } }}

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags 'Project Collections'

      response '200', I18n.t('swagger.patch.200', type: 'project collection', attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        schema response_schema_full
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: 'project collection', attribute: accessor_attribute) do
        let(:Authorization) { reader_auth }
        run_test!
      end
    end

    delete I18n.t('swagger.delete.description', type: 'project collection', attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { model_id }

      security [ apiKey: [] ]
      tags 'Project Collections'

      response '204', I18n.t('swagger.delete.204', type: 'project collection', attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end

  describe "sends a single project" do
    let(:path) { api_v1_project_collection_path(project_collection) }

    context "when the user is an reader" do
      before(:each) { get path, headers: reader_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end

        it "does not include draft projects" do
          included = JSON.parse(response.body).dig("included").reject { |record| record["type"] != "projects" }
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
          included = JSON.parse(response.body).dig("included").reject { |record| record["type"] != "projects" }
          expect(included.length).to eq 2
        end
      end
    end
  end

  describe "creates a collection" do
    let (:path) { api_v1_project_collections_path }
    let(:subject) { FactoryBot.create(:subject) }
    let(:attributes) {
      {
        title: "Project Collection",
        icon: "some-icon",
        smart: true
      }
    }
    let(:relationships) do
      {
        subjects: { data: [{ type: "subjects", id: subject.id }] }
      }
    end
    let(:valid_params) {
      json_payload(attributes: attributes, relationships: relationships)
    }

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
          patch path, headers: headers, params: json_payload()
          expect(response).to have_http_status(200)
        end
      end
    end
  end
end
