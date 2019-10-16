require "swagger_helper"

RSpec.describe "My Reading Groups API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:model) { FactoryBot.create(:reading_group_membership) }
  let(:model_id) { model[:id] }

  tags = ''
  model_name = 'reading_group_membership'
  model_name_plural = 'reading_group_memberships'

  create_request = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }
  create_response = { '$ref' => '#/definitions/RESOURCE_DEFINITION' }

  # path "/#{model_name_plural}" do
  #   post I18n.t('swagger.post.description', type: model_name) do
  #     parameter name: :body, in: :body, schema: create_request
  #     let(:body) { json_structure_for(model_name) }
  #
  #     consumes 'application/json'
  #     produces 'application/json'
  #
  #     security [ apiKey: [] ]
  #     tags tags
  #
  #     response '201', I18n.t('swagger.post.201', type: model_name) do
  #       let(:Authorization) { admin_auth }
  #       schema create_response
  #       run_test!
  #     end
  #
  #     response '403', I18n.t('swagger.access_denied') do
  #       let(:Authorization) { author_auth }
  #       run_test!
  #     end
  #   end
  # end
  #
  # path "/#{model_name_plural}/{model_id}" do
  #   attribute = 'ID'
  #
  #   delete I18n.t('swagger.delete.description', type: model_name, attribute: attribute) do
  #     parameter name: :model_id, :in => :path, :type => :string
  #
  #     security [ apiKey: [] ]
  #     tags tags
  #
  #     response '204', I18n.t('swagger.delete.204', type: model_name, attribute: attribute) do
  #       let(:Authorization) { admin_auth }
  #       run_test!
  #     end
  #
  #     response '403', I18n.t('swagger.access_denied') do
  #       let(:Authorization) { author_auth }
  #       run_test!
  #     end
  #   end
  # end

  let(:another_user) { FactoryBot.create(:user) }

  describe "sends my reading groups" do

    let(:path) { api_v1_me_relationships_reading_groups_path }

    context "when the user is not authenticated" do
      before(:each) { get path }
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end

    context "when the user is a reader" do

      before(:each) {
        get path, headers: reader_headers
      }
      let(:api_response) { JSON.parse(response.body) }

      describe "the response" do

        it "includes an array of data" do
          expect(api_response["data"]).to be_instance_of Array
        end

        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end

      end
    end
  end

end
