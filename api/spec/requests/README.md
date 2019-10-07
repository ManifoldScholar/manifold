# Requests Spec

A sample request swagger file structure

```
require "swagger_helper"

RSpec.describe "NAME OF RESOURCE", type: :request do
  include_context("authenticated request")
  include_context("param helpers")

  let(:model) { FactoryBot.create(RESOURCE) }

  tags = 'category'
  model_name = 'action_callout'
  model_name_plural = 'action_callouts'

  multiple_response = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }

  create_request = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }
  create_response = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }


  path "/#{model_name}" do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do
      produces 'application/json'
      tags tags

      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do
        schema multiple_response
        run_test!
      end
    end

    post I18n.t('swagger.post.description', type: model_name) do
      parameter name: :project_id, :in => :path, :type => :string
      let(:project_id) { model[:id] }

      parameter name: :body, in: :body, schema: create_request
      let(:body) { json_structure_for(model_name) }

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags tags

      response '201', I18n.t('swagger.post.201', type: model_name) do
        let(:Authorization) { admin_auth }
        schema create_response
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end

  path "/#{model_name}/{id}" do
    attribute = 'ID'

    get I18n.t('swagger.get.one.description', type: model_name, attribute: attribute) do
      parameter name: :id, :in => :path, :type => :string
      produces 'application/json'
      tags model_name

      response '200', I18n.t('swagger.get.one.200', type: model_name, attribute: attribute) do
        let(:id) { maker[:id] }
        schema '$ref' => '#/definitions/MakerResponse'
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: model_name, attribute: attribute) do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { maker[:id] }
      parameter name: :maker_attributes, in: :body, schema: { '$ref' => '#/definitions/MakerRequestUpdate' }
      let(:maker_attributes) {{ data: { attributes: FactoryBot.attributes_for(:maker) } }}

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags model_name

      response '200', I18n.t('swagger.patch.200', type: model_name, attribute: attribute) do
        let(:Authorization) { admin_auth }
        schema '$ref' => '#/definitions/MakerResponse'
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: model_name, attribute: attribute) do
        let(:Authorization) { reader_auth }
        run_test!
      end
    end

    delete I18n.t('swagger.delete.description', type: model_name, attribute: attribute) do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { maker[:id] }

      security [ apiKey: [] ]
      tags model_name

      response '204', I18n.t('swagger.delete.204', type: model_name, attribute: attribute) do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end
```
