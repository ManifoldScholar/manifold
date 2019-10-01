require "swagger_helper"

RSpec.describe "Resources API", type: :request do

  model_name = 'resource'
  model_name_plural = 'resources'
  request_create_schema = { '$ref' => '#/definitions/' }
  request_update_schema = { '$ref' => '#/definitions/ResourceRequestUpdate' }
  single_record_response = { '$ref' => '#/definitions/ResourceResponse' }
  multiple_record_response = { '$ref' => '#/definitions/ResourcesResponse' }

  include_context("authenticated request")
  include_context("param helpers")

  let(:resource) { FactoryBot.create(:resource) }

  path "/#{model_name_plural}" do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do
      produces 'application/json'
      tags model_name_plural

      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do
        schema multiple_record_response
        run_test!
      end
    end

    # TODO check about the status of the resources create route
    # It is likely that this should be removed like the texts and
    # resource_collections create endpoints
    # post I18n.t('swagger.post.description', type: model_name_plural) do
    #
    #   parameter name: :body, in: :body, schema: request_update_schema
    #   let(:body) { json_structure_for(model_name) }
    #
    #   consumes 'application/json'
    #   produces 'application/json'
    #   security [ apiKey: [] ]
    #   tags model_name_plural
    #
    #   response '201', I18n.t('swagger.post.201', type: model_name_plural) do
    #     let(:Authorization) { admin_auth }
    #     schema request_create_schema
    #     run_test!
    #   end
    # end
  end

  path "/#{model_name_plural}/{id}" do
    accessor_attribute = 'ID'
    let(:id) { resource[:id] }

    get I18n.t('swagger.get.one.description', type: model_name_plural, attribute: accessor_attribute) do
      parameter name: :id, in: :path, :type => :string
      produces 'application/json'
      tags model_name_plural

      response '200', I18n.t('swagger.get.one.200', type: model_name_plural, attribute: accessor_attribute) do
        schema single_record_response
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, in: :path, :type => :string

      parameter name: :body, in: :body, schema: request_update_schema
      let(:body) { json_structure_for(model_name) }

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags model_name_plural

      response '200', I18n.t('swagger.patch.200', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        schema request_update_schema
        run_test!
      end

      response '403', I18n.t("swagger.access_denied") do
        let(:Authorization) { author_auth }
        run_test!
      end
    end

    delete 'Removes a resource' do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { resource.id }

      security [ apiKey: [] ]
      tags 'resources'

      response '204', 'resource deleted' do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t("swagger.access_denied") do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end

  describe "updates a resource" do

    let(:path) { api_v1_resource_path(resource) }

    context "when the user is an admin" do

      let(:headers) { admin_headers }
      let(:metadata) {
        {
          "rights" => "Free",
          "rightsTerritory" => "USA",
          "restrictions" => "No Bozos",
          "creator" => "Biff McFly",
        }
      }

      describe "the response" do
        context "body" do
          it("contains the updated title") { expect_updated_param("title", "some title") }
          it("contains the updated caption") { expect_updated_param("caption", "some caption") }
          it("contains the updated description") { expect_updated_param("description", "some description") }
          it("contains the updated tag_list") { expect_updated_param("tagList", "glorp,glomp", ["glorp", "glomp"]) }
          it("contains the updated alt_text") { expect_updated_param("altText", "some alt_text") }
          it("contains the updated metadata") { expect_updated_param("metadata", metadata) }
          it("contains the updated credit") { expect_updated_param("title", "some credit") }
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: json_payload()
          expect(response).to have_http_status(200)
        end
      end
    end
  end
end
