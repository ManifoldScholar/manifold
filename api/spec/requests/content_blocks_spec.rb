require "swagger_helper"

RSpec.describe "ContentBlocks API", type: :request do
  include_context("authenticated request")
  include_context("param helpers")

  let(:content_block) { FactoryBot.create(:markdown_block) }
  let(:path) { api_v1_content_block_path(content_block) }
  let(:api_response) { JSON.parse(response.body) }

  path '/content_blocks/{id}' do
    get I18n.t('swagger.get.one.description', type: 'content block', attribute: 'ID') do
      produces 'application/json'

      parameter name: :id, :in => :path, :type => :string
      let(:id) { content_block[:id] }

      tags 'Content blocks'

      response '200', I18n.t('swagger.get.one.200', type: 'content block', attribute: 'ID') do
        schema '$ref' => '#/definitions/ContentBlockResponse'
        run_test!
      end
    end

    patch I18n.t('swagger.patch.description', type: 'content block', attribute: 'ID') do
      consumes 'application/json'
      produces 'application/json'
      security [ apiKey: [] ]

      parameter name: :id, :in => :path, :type => :string
      let(:id) { content_block[:id] }

      parameter name: :content_block_arguments, :in => :body, schema: { '$ref' => '#/definitions/ContentBlockRequestUpdate' }

      tags 'Content blocks'

      response '200', I18n.t('swagger.unprocessable', type: 'content block', attribute: 'ID') do
        let(:Authorization) { admin_auth }
        let(:content_block_arguments) {{ data: { attributes: FactoryBot.attributes_for(:markdown_block) } }}
        schema '$ref' => '#/definitions/ContentBlockResponse'
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: 'content block', attribute: 'ID') do
        let(:Authorization) { reader_auth }
        let(:content_block_arguments) {{ data: { attributes: FactoryBot.attributes_for(:markdown_block) } }}
        run_test!
      end
    end

    delete I18n.t('swagger.delete.description', type: 'content block', attribute: 'ID') do
      security [ apiKey: [] ]

      parameter name: :id, :in => :path, :type => :string
      let(:id) { content_block[:id] }

      tags 'Content blocks'

      response '204', I18n.t('swagger.delete.204', type: 'content block', attribute: 'ID') do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: 'content block', attribute: 'ID') do
        let(:Authorization) { reader_auth }
        run_test!
      end
    end
  end

  describe "updates a content block" do
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        context "body" do
          it("contains the updated attributes") { expect_updated_param("body", "new body") }

          it "contains the updated relationships" do
            toc_block = FactoryBot.create(:toc_block)
            new_text = FactoryBot.create(:text, project: toc_block.project)
            path = api_v1_content_block_path(toc_block)

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
end
