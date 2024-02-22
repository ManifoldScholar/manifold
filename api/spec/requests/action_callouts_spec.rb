# frozen_string_literal: true

RSpec.describe "Action Callout API", type: :request do
  let(:action_callout) { FactoryBot.create(:action_callout) }
  let(:path) { api_v1_action_callout_path(action_callout) }
  let(:api_response) { JSON.parse(response.body) }

  describe "updates a call to action" do
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        it "has a 200 OK status code" do
          patch path, headers: headers, params: build_json_payload
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

            patch path, headers: headers, params: build_json_payload(relationships: params)
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
