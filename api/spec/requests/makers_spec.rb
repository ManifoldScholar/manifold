require "swagger_helper"

RSpec.describe "Makers API", type: :request do
  model_name = "makers"

  include_context("authenticated request")
  include_context("param helpers")

  let(:maker) { FactoryBot.create(:maker) }


  path "/#{model_name}" do
    get I18n.t('swagger.get.all.description', type: model_name) do
      produces 'application/json'
      tags model_name

      response '200', I18n.t('swagger.get.all.200', type: model_name) do
        schema '$ref' => '#/definitions/MakersResponse'
        run_test!
      end
    end

    post I18n.t('swagger.post.description', type: 'maker') do
      consumes 'application/json'
      produces 'application/json'

      parameter name: :maker_attributes, in: :body, schema: { '$ref' => '#/definitions/MakerRequestCreate' }
      security [ apiKey: [] ]
      tags model_name

      response '201', I18n.t('swagger.post.201', type: model_name) do
        let(:Authorization) { admin_auth }
        let(:maker_attributes) {{ data: { attributes: FactoryBot.attributes_for(:maker) }}}

        schema '$ref' => '#/definitions/MakerResponse'
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: model_name) do
        let(:Authorization) { reader_auth }
        let(:maker_attributes) {{ data: { attributes: FactoryBot.attributes_for(:maker) }}}
        run_test!
      end
    end
  end

  path "/#{model_name}/{id}" do
    accessor_attribute = 'ID'

    get I18n.t('swagger.get.one.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      produces 'application/json'
      tags model_name

      response '200', I18n.t('swagger.get.one.200', type: model_name, attribute: accessor_attribute) do
        let(:id) { maker[:id] }
        schema '$ref' => '#/definitions/MakerResponse'
        run_test!
      end

      response '404', I18n.t('swagger.not_found') do
        let(:id) { 'a' }
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { maker[:id] }
      parameter name: :maker_attributes, in: :body, schema: { '$ref' => '#/definitions/MakerRequestUpdate' }
      let(:maker_attributes) {{ data: { attributes: FactoryBot.attributes_for(:maker) } }}

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags model_name

      response '200', I18n.t('swagger.patch.200', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { admin_auth }
        schema '$ref' => '#/definitions/MakerResponse'
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: model_name, attribute: accessor_attribute) do
        let(:Authorization) { reader_auth }
        run_test!
      end
    end

    delete I18n.t('swagger.delete.description', type: model_name, attribute: accessor_attribute) do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { maker[:id] }

      security [ apiKey: [] ]
      tags model_name

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

  describe "updates a maker" do

    let(:path) { api_v1_maker_path(maker) }

    context "when the user is an admin" do

      let(:headers) { admin_headers }

      describe "the response" do
        context "body" do
          it("contains the updated first_name") { expect_updated_param("firstName", "john") }
          it("contains the updated last_name") { expect_updated_param("lastName", "smith") }
        end
      end
    end
  end
end
