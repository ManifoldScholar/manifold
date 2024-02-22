# frozen_string_literal: true

RSpec.describe "API Error Handling", type: :request do
  context "when requesting a non-existing route" do
    let(:api_response) { JSON.parse(response.body) }

    it "conforms to expectations" do
      expect do
        get "/api/v1/rambo/bananas"
      end.to execute_safely

      api_response = JSON.parse(response.body)

      aggregate_failures do
        expect(api_response).to include_json(
          errors: [
            { id: "API_ERROR", status: 404 },
          ],
        )

        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
