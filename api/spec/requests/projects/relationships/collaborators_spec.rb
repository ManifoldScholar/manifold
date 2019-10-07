require "swagger_helper"

RSpec.describe "Project Collaborators API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:project) { FactoryBot.create(:project) }
  let(:maker) { FactoryBot.create(:maker) }
  let(:collaborator) {
    FactoryBot.create(:collaborator, maker: maker, collaboratable: project)
  }

  describe "sends a project collaborator" do
    let(:path) { api_v1_project_relationships_collaborator_path(project, collaborator) }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

  tags = 'resources'
  model_name = 'collaborator'
  model_name_plural = 'collaborators'

  get_model = { '$ref' => '#/definitions/CollaboratorGet' }
  get_models = { '$ref' => '#/definitions/CollaboratorsGet' }

  create_request = { '$ref' => '#/definitions/CollaboratorCreateRequest' }
  create_response = { '$ref' => '#/definitions/CollaboratorCreateResponse' }

  # update_request = { '$ref' => '#/definitions/CollaboratorUpdateRequest' }
  # update_response = { '$ref' => '#/definitions/CollaboratorUpdateResponse' }

  path "/projects/{project_id}/relationships/#{model_name_plural}" do
    get I18n.t('swagger.get.all.description', type: model_name_plural) do

      parameter name: :project_id, :in => :path, :type => :string
      let(:project_id) { project[:id] }

      produces 'application/json'
      tags tags

      response '200', I18n.t('swagger.get.all.200', type: model_name_plural) do
        schema get_models
        run_test!
      end
    end

    # TODO check out why getting a 404 on post
    # post I18n.t('swagger.post.description', type: model_name) do
    #
    #   parameter name: :project_id, :in => :path, :type => :string
    #   let(:project_id) { project[:id] }
    #
    #   parameter name: :body, in: :body, schema: create_request
    #   let(:body) {
    #     json_structure({
    #       attributes: FactoryBot::attributes_for(
    #         model_name,
    #         maker: maker,
    #         collaboratable: project
    #       )
    #     })
    #   }
    #
    #   consumes 'application/json'
    #   produces 'application/json'
    #   security [ apiKey: [] ]
    #   tags tags
    #
    #   response '201', I18n.t('swagger.post.201', type: model_name) do
    #     let(:Authorization) { admin_auth }
    #     schema create_response
    #     run_test!
    #   end
    # end
  end

  path "/projects/{project_id}/relationships/#{model_name_plural}/{id}" do
    attribute = 'ID'

    get I18n.t('swagger.get.one.description', type: model_name, attribute: attribute) do
      produces 'application/json'

      parameter name: :project_id, :in => :path, :type => :string
      let(:project_id) { project[:id] }

      parameter name: :id, in: :path, :type => :string
      let(:id) { collaborator[:id] }

      tags model_name_plural

      response '200', I18n.t('swagger.get.one.200', type: model_name, attribute: attribute) do
        schema get_model
        run_test!
      end
    end

    # TODO check out why getting a 404 on post
    # patch I18n.t('swagger.patch.description', type: model_name, attribute: attribute) do
    #   consumes 'application/json'
    #   produces 'application/json'
    #
    #   parameter name: :id, in: :path, :type => :string
    #   let(:id) { reader[:id] }
    #
    #   parameter name: :user, in: :body, schema: update_request
    #   let(:user) { { data: { attributes: { first_name: first_name } } } }
    #
    #   security [ apiKey: [] ]
    #   tags model_name_plural
    #
    #   response '200', I18n.t('swagger.patch.200', type: model_name, attribute: attribute) do
    #     let(:Authorization) { admin_auth }
    #     schema update_response
    #     run_test!
    #   end
    #
    #   response '403', I18n.t('swagger.access_denied') do
    #     let(:Authorization) { author_auth }
    #     run_test!
    #   end
    # end

    # TODO check out why getting a 404 on delete
    # delete I18n.t('swagger.delete.description', type: model_name, attribute: attribute) do
    #
    #   parameter name: :project_id, :in => :path, :type => :string
    #   let(:project_id) { project[:id] }
    #
    #   parameter name: :id, in: :path, :type => :string
    #   let(:id) { collaborator[:id] }
    #
    #   security [ apiKey: [] ]
    #   tags model_name_plural
    #
    #   response '204', I18n.t('swagger.delete.204', type: model_name, attribute: attribute) do
    #     let(:Authorization) { admin_auth }
    #     run_test!
    #   end
    #
    #   response '403', I18n.t('swagger.access_denied') do
    #     let(:Authorization) { author_auth }
    #     run_test!
    #   end
    # end
  end
end
