require "swagger_helper"

RSpec.describe "Action Callout API", type: :request do
  include_context("authenticated request")
  include_context("param helpers")

  let(:action_callout) { FactoryBot.create(:action_callout) }
  let(:path) { api_v1_action_callout_path(action_callout) }
  let(:api_response) { JSON.parse(response.body) }

  path '/action_callouts/{id}' do
    get I18n.t('swagger.get.one.description', type: 'action callout', attribute: 'ID') do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { action_callout[:id] }

      produces 'application/json'
      tags 'Action Callouts'

      response '200', I18n.t('swagger.get.one.200', type: 'action callout', attribute: 'ID') do
        schema '$ref' => '#/definitions/ActionCalloutResponse'
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: 'action callout', attribute: 'ID') do
      parameter name: :id, :in => :path, :type => :string

      parameter name: :action_callout_patch, in: :body, schema: { '$ref' => '#/definitions/ActionCalloutRequestUpdate' }
      let(:action_callout_patch) {
        {
          data:{
            attributes: {
              title: "this",
              kind: "link",
              location: "left",
              button: "String",
              position: "top",
              url: "http://this.that",
              removeAttachment: true,
            }
          }
        }
      }

      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]
      tags 'Action Callouts'

      response '200', I18n.t('swagger.patch.200', type: 'action callout', attribute: 'ID') do
        let(:Authorization) { admin_auth }
        let(:id) { action_callout[:id] }
        schema '$ref' => '#/definitions/ProjectResponseFull'
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { reader_auth }
        let(:id) { action_callout[:id] }
        run_test!
      end

      response '404', I18n.t('swagger.not_found') do
        let(:Authorization) { reader_auth }
        let(:id) { 'a' }
        schema '$ref' => '#/definitions/NotFound'
        run_test!
      end
    end

    delete I18n.t('swagger.delete.description', type: 'action callout', attribute: 'ID') do
      parameter name: :id, :in => :path, :type => :string
      let(:id) { action_callout[:id] }
      security [ apiKey: [] ]
      tags 'Action Callouts'

      response '204', I18n.t('swagger.delete.204', type: 'action callout', attribute: 'ID') do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t('swagger.access_denied') do
        let(:Authorization) { author_auth }
        run_test!
      end
    end
  end

  describe "updates a call to action" do
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        it "has a 200 OK status code" do
          patch path, headers: headers, params: json_payload
          expect(response).to have_http_status(200)
        end

        context "body" do
          it("contains the updated attributes") { expect_updated_param("title", "a different title") }

          it "contains the updated relationships" do
            toc_action_callout = FactoryBot.create(:toc_action_callout)
            new_text = FactoryBot.create(:text, project: toc_action_callout.project)
            path = api_v1_action_callout_path(toc_action_callout)

            params = {
              text: {
                data: {
                  id: new_text.id,
                  type: "texts"
                }
              }
            }

            patch path, headers: headers, params: json_payload(relationships: params)
            api_response = JSON.parse(response.body)
            expect(api_response.dig("data", "relationships", "text", "data", "id")).to eq new_text.id
          end
        end
      end
    end
  end

  describe "destroys a call to action" do
    context "when the user is an admin" do
      it "has a 204 status code" do
        delete path, headers: admin_headers
        expect(response).to have_http_status(204)
      end
    end

    context "when the user is a reader" do
      it "has a 403 FORBIDDEN status code" do
        delete path, headers: reader_headers
        expect(response).to have_http_status(403)
      end
    end
  end
end
