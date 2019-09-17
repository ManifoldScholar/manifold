require "swagger_helper"

RSpec.describe "Pages API", type: :request do
  model_name = "page"
  model_name_plural = "pages"
  request_create_schema = { '$ref' => '#/definitions/PageRequestCreate' }
  request_update_schema = { '$ref' => '#/definitions/PageRequestUpdate' }
  response_schema = { '$ref' => '#/definitions/PageResponse' }

  include_context("authenticated request")
  include_context("param helpers")

  let(:page) { FactoryBot.create(:page) }
  let(:model_id) { page[:id] }

  path "/#{model_name_plural}" do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do
      produces 'application/json'
      tags model_name_plural

      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do
        schema '$ref' => '#/definitions/PagesResponse'
        run_test!
      end
    end

    post I18n.t('swagger.post.description', type: model_name) do
      consumes 'application/json'
      produces 'application/json'

      parameter name: :page_attributes, in: :body, schema: request_create_schema
      security [ apiKey: [] ]
      tags model_name_plural

      response '201', I18n.t('swagger.post.201', type: model_name) do
        let(:Authorization) { admin_auth }
        let(:page_attributes) {{ data: { attributes: FactoryBot.attributes_for(:page) }}}

        schema response_schema
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: model_name) do
        let(:Authorization) { reader_auth }
        let(:page_attributes) {{ data: { attributes: FactoryBot.attributes_for(:page) }}}
        run_test!
      end
    end
  end

  path "/#{model_name_plural}/{id}" do
    accessor_attribute = 'ID'

    get I18n.t('swagger.get.one.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      produces 'application/json'
      tags model_name_plural

      response '200', I18n.t('swagger.get.one.200', type: model_name, attribute: accessor_attribute) do
        let(:id) { model_id }
        schema '$ref' => '#/definitions/PageResponseFull'
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
      parameter name: :maker_attributes, in: :body, schema: request_update_schema
      let(:maker_attributes) {{ data: { attributes: FactoryBot.attributes_for(:maker) } }}

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags model_name_plural

      response '200', I18n.t('swagger.patch.200', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        schema '$ref' => '#/definitions/PageResponseFull'
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

end
