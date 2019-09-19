require "swagger_helper"

RSpec.describe "Subject API", type: :request do

  model_name = 'subject'
  model_name_plural = 'subjects'
  request_create_schema = { '$ref' => '#/definitions/SubjectRequestCreate' }
  request_update_schema = { '$ref' => '#/definitions/SubjectRequestUpdate' }
  response_schema = { '$ref' => '#/definitions/SubjectResponse' }
  response_schema_all = { '$ref' => '#/definitions/SubjectsResponse' }
  model_attributes = { data: { attributes: FactoryBot.attributes_for(:subject) }}

  include_context("authenticated request")
  include_context("param helpers")

  let(:subject_a) { FactoryBot.create(:subject) }
  let(:subject_b) { FactoryBot.create(:subject, name: "Rowan") }


  path "/#{model_name_plural}" do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do
      produces 'application/json'
      tags model_name_plural

      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do
        schema response_schema_all
        run_test!
      end
    end

    post I18n.t('swagger.post.description', type: model_name) do
      consumes 'application/json'
      produces 'application/json'

      parameter name: :subject_params, in: :body, schema: request_create_schema
      security [ apiKey: [] ]
      tags model_name_plural

      response '201', I18n.t('swagger.post.201', type: model_name) do
        let(:Authorization) { admin_auth }
        let(:subject_params) { model_attributes }

        schema response_schema
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: model_name) do
        let(:Authorization) { reader_auth }
        let(:subject_params) { model_attributes }
        run_test!
      end
    end
  end

  path "/#{model_name_plural}/{id}" do
    accessor_attribute = 'ID'
    let(:model_id) { subject_a[:id] }

    get I18n.t('swagger.get.one.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      produces 'application/json'
      tags model_name_plural

      response '200', I18n.t('swagger.get.one.200', type: model_name, attribute: accessor_attribute) do
        let(:id) { model_id }
        schema response_schema
        run_test!
      end

      response '404', I18n.t('swagger.not_found') do
        let(:id) { 'a' }
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { model_id }
      parameter name: :subject_params, in: :body, schema: request_update_schema
      let(:subject_params) { model_attributes }

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags model_name_plural

      response '200', I18n.t('swagger.patch.200', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        schema response_schema
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { reader_auth }
        run_test!
      end
    end

    delete I18n.t('swagger.delete.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { model_id }

      security [ apiKey: [] ]
      tags model_name_plural

      response '204', I18n.t('swagger.delete.204', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end

  describe "responds with a list of featured project subjects" do
    describe "the response" do
      let(:params) {
        {
          filter: {
            featured: true
          }
        }
      }
      it "has a 200 status code" do
        FactoryBot.create(:project, subjects: [subject_a])
        FactoryBot.create(:project, featured: true, subjects: [subject_b])
        get api_v1_subjects_path(params: params)
        entities = JSON.parse(response.body)["data"]
        expect(entities.count).to eq(1)
        expect(response).to have_http_status(200)
      end
    end
  end
end
