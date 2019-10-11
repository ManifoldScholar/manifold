require "swagger_helper"

RSpec.describe "Project Events API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")
  let(:model) { FactoryBot.create(:project) }

  tags = 'event'
  model_name = 'event'
  model_name_plural = 'events'

  response_schema = { '$ref' => '#/definitions/ProjectEventsResponse' }

  before(:each) do
    FactoryBot.create(:event, project: model, event_type: EventType[:tweet])
    FactoryBot.create(:event, project: model, event_type: EventType[:comment_created])
    FactoryBot.create(:event, project: model, event_type: EventType[:text_annotated])
    FactoryBot.create(:event, project: model, event_type: EventType[:resource_added])
  end

  path "/projects/{project_id}/relationships/#{model_name_plural}" do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do

      parameter name: :project_id, :in => :path, :type => :string
      let(:project_id) { model[:id] }

      produces 'application/json'
      tags tags

      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do
        schema response_schema
        run_test! do |response|

          # additional validation to ensure that the comment_created and
          # text_annotated types are not present
          api_response = JSON.parse(response.body)
          event_types = api_response["data"].map {
            |event| event.dig("attributes", "eventType")
          }
          expect(event_types).to_not include EventType[:comment_created], EventType[:text_annotated]
        end
      end
    end
  end
end
