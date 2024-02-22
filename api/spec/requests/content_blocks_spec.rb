# frozen_string_literal: true

RSpec.describe "ContentBlocks API", type: :request do
  let(:content_block) { FactoryBot.create(:markdown_block) }
  let(:path) { api_v1_content_block_path(content_block) }
  let(:api_response) { JSON.parse(response.body) }

  describe "sends a content block" do
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        it "has a 200 status code" do
          get path, headers: headers
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      describe "the response" do
        it "has a 200 status code" do
          get path, headers: headers
          expect(response).to have_http_status(200)
        end
      end
    end
  end

  describe "updates a content block" do
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        it "has a 200 OK status code" do
          patch path, headers: headers, params: build_json_payload
          expect(response).to have_http_status(200)
        end

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

            patch path, headers: headers, params: build_json_payload(relationships: params)
            api_response = JSON.parse(response.body)
            expect(api_response.dig("data", "relationships", "text", "data", "id")).to eq new_text.id
          end
        end
      end
    end
  end

  describe "destroys a content block" do
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
