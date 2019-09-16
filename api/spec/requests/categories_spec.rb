require "swagger_helper"

RSpec.describe "Categories API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:category) { FactoryBot.create(:category, role: Category::ROLE_TEXT) }

  path '/categories/{id}' do
    parameter name: :id, :in => :path, :type => :string
    let(:id) { category[:id] }

    get I18n.t('swagger.get.one.description', type: 'category', attribute: 'ID') do
      produces 'application/json'
      tags 'Categories'

      response '200', I18n.t('swagger.get.one.200', type: 'category', attribute: 'ID') do
        schema '$ref' => '#/definitions/CategoryResponse'
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: 'category', attribute: 'ID') do
      consumes 'application/json'
      produces 'application/json'

      parameter name: :category_patch, :in => :body, :schema => { '$ref' => '#/definitions/CategoryRequestUpdate' }
      let(:category_patch) {{ data: { attributes: FactoryBot.attributes_for(:category) } }}

      security [ apiKey: [] ]
      tags 'Categories'

      response '200', I18n.t('swagger.patch.200', type: 'category', attribute: 'ID') do
        let(:Authorization) { admin_auth }
        schema '$ref' => '#/definitions/CategoryResponse'
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end

    delete I18n.t('swagger.delete.description', type: 'category', attribute: 'ID') do
      security [ apiKey: [] ]
      tags 'Categories'

      response '204', I18n.t('swagger.delete.204', type: 'category', attribute: 'ID') do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end


  describe "updates a text" do

    it_should_behave_like "orderable api requests" do
      let(:path) { "api_v1_category_path" }
      let!(:object_a) { FactoryBot.create(:category, position: 1) }
      let!(:object_b) { FactoryBot.create(:category, position: 2, project: object_a.project) }
    end
  end
end
