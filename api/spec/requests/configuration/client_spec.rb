require "rails_helper"

RSpec.describe "Client Configuration API", type: :request do

  describe "sends the configuration" do

    describe "the response" do
      before(:each) { get api_v1_configuration_client_path }
      let(:api_response) { JSON.parse(response.body) }

      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end

      it "contains the configuration object" do
        expect(api_response).to be_a Hash
      end

    end
  end
end
