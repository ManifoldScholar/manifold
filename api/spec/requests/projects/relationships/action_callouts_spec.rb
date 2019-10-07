require "swagger_helper"

RSpec.describe "Project ActionCallout API", type: :request do
  include_context("authenticated request")
  include_context("param helpers")

  let(:model) { FactoryBot.create(:project) }

  tags = 'category'
  model_name = 'action_callout'
  model_name_plural = 'action_callouts'

  multiple_response = { '$ref' => '#/definitions/ActionCalloutResponses' }

  create_request = { '$ref' => '#/definitions/ActionCalloutRequestCreate' }
  create_response = { '$ref' => '#/definitions/ActionCalloutResponse' }

  path "/projects/{project_id}/relationships/#{model_name_plural}" do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do

      parameter name: :project_id, :in => :path, :type => :string
      let(:project_id) { model[:id] }

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
end
