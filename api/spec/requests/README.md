# Requests Spec

## A sample rswag file test

* Anything in all caps should be replaced with whatever text is appropriate for the file
* Feel free to remove all comments from this file when implementing it

```
require "swagger_helper"

RSpec.describe "NAME OF RESOURCE", type: :request do
  include_context("authenticated request")     # scope of the auth variables
  include_context("param helpers")             # path generator helpers for non-swagger tests

  let(:model) { FactoryBot.create(RESOURCE) }

  tags = 'TAG'
  model_name = 'MODEL_NAME'
  model_name_plural = 'MODEL_NAME_PLURAL'

  # each variable is likely only used once, but it makes it easier to modify the
  # schemas from a single location in the file

  get_model = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }
  get_models = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }

  create_request = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }
  create_response = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }

  update_request = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }
  update_response = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }


  # the path where the tests should be run
  path "/#{model_name_plural}" do

    # get description uses a translation string with a type variable
    # eg "Returns all %{type}"
    get I18n.t('swagger.get.all.description', type: model_name_plural) do

      produces 'application/json'   # returns a json
      tags tags                     # tag the route with whatever is in the tags variable

      # eg "Returns an array of %{type} objects"
      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do

        schema get_models           # a get that returns more than one instance of the model
        run_test!                   # an rswag method
      end
    end

    post I18n.t('swagger.post.description', type: model_name) do

      # define the schema of the body sent in
      parameter name: :body, in: :body, schema: create_request
      let(:body) { json_structure_for(model_name) }

      consumes 'application/json'
      produces 'application/json'

      # this project uses an api key, which will be defined in the 'Authorization' variable
      # this is only required if the route requires authorization
      security [ apiKey: [] ]
      tags tags

      response '201', I18n.t('swagger.post.201', type: model_name) do
        let(:Authorization) { admin_auth }   # set the authorization key
        schema create_response
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end

  # '#{model_name_plural}' will be replaced by the variable at the top of the page
  # '{id}' will be set as a variable in the test
  path "/#{model_name_plural}/{id}" do
    attribute = 'ID'  # a handy variable for passing into the translation strings

    # eg "Returns the %{type} with the given %{attribute}"
    get I18n.t('swagger.get.one.description', type: model_name, attribute: attribute) do

      # tell rswag that whatever you decalre as let(:id) in the test
      # will be associated with the {id} in the path
      parameter name: :id, :in => :path, :type => :string

      produces 'application/json'
      tags tags

      response '200', I18n.t('swagger.get.one.200', type: model_name, attribute: attribute) do
        let(:id) { model[:id] }
        schema get_model
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: model_name, attribute: attribute) do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { model[:id] }

      parameter name: :body, in: :body, schema: update_request
      let(:body) { json_structure_for(model_name) }

      consumes 'application/json'
      produces 'application/json'

      security [ apiKey: [] ]
      tags tags

      response '200', I18n.t('swagger.patch.200', type: model_name, attribute: attribute) do
        let(:Authorization) { admin_auth }
        schema update_response
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: model_name, attribute: attribute) do
        let(:Authorization) { reader_auth }
        run_test!
      end
    end

    delete I18n.t('swagger.delete.description', type: model_name, attribute: attribute) do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { model[:id] }

      security [ apiKey: [] ]
      tags tags

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
end
```

## Possible Improvements

* Take repetitive code like the delete blocks and make them a single function that can be called while only passing in variables.
