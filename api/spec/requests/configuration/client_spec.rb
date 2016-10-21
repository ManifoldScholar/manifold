require "rails_helper"

RSpec.describe "api/v1/configuration/client", type: :request do

  describe "GET /api/v1/configuration/client" do

    it "returns 200 response header" do
      get api_v1_configuration_client_path
      expect(response).to have_http_status(200)
    end

    it "returns a configuration object" do
      get api_v1_configuration_client_path
      api_response = JSON.parse(response.body)
      expect(api_response).to be_a Hash
    end

  end
end
