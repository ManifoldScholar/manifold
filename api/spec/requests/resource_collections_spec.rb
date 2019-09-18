require "swagger_helper"

RSpec.describe "Resource Collections API", type: :request do
  model_name = "resource_collection"
  model_name_plural = "resource_collections"
  request_create_schema = { '$ref' => '#/definitions/ResourceCollectionRequestCreate' }
  request_update_schema = { '$ref' => '#/definitions/ResourceCollectionRequestUpdate' }
  response_schema = { '$ref' => '#/definitions/ResourceCollectionResponse' }
  response_schema_all = { '$ref' => '#/definitions/ResourceCollectionsResponse' }

  include_context("authenticated request")
  include_context("param helpers")

  let(:collection) { FactoryBot.create(:resource_collection) }

  path '/resource_collections' do
    get I18n.t('swagger.get.all.description', type: 'resource collection') do
      produces 'application/json'
      tags 'resource collections'

      response '200', I18n.t('swagger.get.all.200', type: 'resource collections') do
        schema response_schema_all
        run_test!
      end
    end

    # do not document the POST on this route. It will be removed in the future
  end

  path '/resource_collections/{id}' do
    accessor_attribute = 'ID'
    let(:id) { collection[:id] }

    get 'Get a specific resource collection' do
      consumes 'application/json'
      produces 'application/json'
      parameter name: :id, in: :path, :type => :string
      tags 'resource collections'

      response '200', I18n.t('swagger.get.one.200', type: 'resource collection', attribute: accessor_attribute) do
        schema response_schema
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: 'resource collection', attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      parameter name: :resource_collection_params, in: :body, schema: request_update_schema
      let(:resource_collection_params) { json_structure_for(:resource_collection) }

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags 'resource collections'

      response '200', I18n.t('swagger.patch.200', type: 'resource collection', attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        schema response_schema
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: 'resource collection', attribute: accessor_attribute) do
        let(:Authorization) { reader_auth }
        run_test!
      end
    end

    delete 'Deletes a specific resource collection' do
      produces 'application/json'

      parameter name: :id, in: :path, :type => :string
      let(:id) { collection[:id] }

      security [ apiKey: [] ]
      tags 'resource collections'

      response '204', 'removes a specific resource collection' do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end

  describe "updates a collection" do

    let(:path) { api_v1_resource_collection_path(collection) }

    context "when the user is an admin" do

      let(:headers) { admin_headers }

      describe "the response" do
        context "body" do
          it("contains the updated title") { expect_updated_param("title", "some title") }
          it("contains the updated description") { expect_updated_param("description", "some description") }
        end
      end
    end
  end
end
