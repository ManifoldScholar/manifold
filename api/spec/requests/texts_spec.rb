require "swagger_helper"

RSpec.describe "Texts API", type: :request do
  request_create_schema = { '$ref' => '#/definitions/TextRequestCreate' }
  request_update_schema = { '$ref' => '#/definitions/TextRequestUpdate' }
  response_schema = { '$ref' => '#/definitions/TextResponse' }
  response_schema_full = { '$ref' => '#/definitions/TextResponseFull' }
  model_name = 'text'
  model_name_plural = 'texts'

  include_context("authenticated request")
  include_context("param helpers")

  let(:text) { FactoryBot.create(:text) }

  path '/texts' do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do
      produces 'application/json'
      tags 'texts'

      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do
        schema response_schema
        run_test!
      end
    end

    # do not document the POST on this route. It will be removed in the future
  end

  path '/texts/{id}' do
    accessor_attribute = 'ID'
    let(:id) { text[:id] }

    get I18n.t('swagger.get.one.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, in: :path, :type => :string
      produces 'application/json'
      tags 'texts'

      response '200', I18n.t('swagger.get.one.200', type: model_name, attribute: accessor_attribute) do
        schema response_schema_full
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, in: :path, :type => :string

      parameter name: :body, in: :body, schema: request_update_schema
      let(:body) { json_structure_for(:text) }

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags 'texts'

      response '200', I18n.t('swagger.patch.200', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        schema response_schema_full
        run_test!
      end

      response '403', I18n.t("swagger.access_denied") do
        let(:Authorization) { author_auth }
        run_test!
      end
    end

    delete I18n.t('swagger.delete.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, in: :path, :type => :string
      security [ apiKey: [] ]
      tags 'texts'

      response '204', I18n.t('swagger.delete.204', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t("swagger.access_denied") do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end

  describe "sends a text" do
    let(:text_id ) { text.id }
    let(:stylesheet) { FactoryBot.create(:stylesheet, text_id: text_id) }
    let(:path) { api_v1_text_path(text) }
    let(:api_response) { JSON.parse(response.body) }

    before(:each) do
      stylesheet
      get path
    end

    describe "the response" do
      it "includes the text's stylesheets" do
        text.reload
        included = api_response["included"].find_index do |inc|
          inc["id"] == stylesheet.id
        end
        expect(included).to_not be nil
      end
    end

  end

  describe "updates a text" do

    it_should_behave_like "orderable api requests" do
      let(:path) { "api_v1_text_path" }
      let!(:object_a) { FactoryBot.create(:text, position: 1) }
      let!(:object_b) { FactoryBot.create(:text, position: 2, project: object_a.project) }
    end
  end

end
