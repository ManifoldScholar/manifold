require "swagger_helper"

RSpec.describe "Tag API", type: :request do

  model_name_plural = 'tags'
  response_schema_all = { '$ref' => '#/definitions/TagsResponse' }

  include_context("authenticated request")
  include_context("param helpers")

  before(:each) { 5.times { FactoryBot.create(:tag, name: Faker::Creature::Dog.unique.breed) } }

  path "/#{model_name_plural}" do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do
      produces 'application/json'
      tags model_name_plural

      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do
        schema response_schema_all
        run_test!
      end
    end
  end
end
