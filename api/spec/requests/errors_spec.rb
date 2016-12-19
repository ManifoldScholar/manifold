require "rails_helper"

RSpec.describe "API Error Handling", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  context "404 requests" do

    before(:each) { get "/api/v1/rambo/bananas" }
    let(:api_response) { JSON.parse(response.body) }

    describe "contains a structured error response" do
      describe "errors" do
        it "is an array" do
          expect(api_response["errors"]).to be_instance_of Array
        end
        describe "it's first error" do
          let(:error) { api_response["errors"].first }
          it "has an ID of API_ERROR" do
            expect(error["id"]).to eq "API_ERROR"
          end
          it "has a 404 status" do
            expect(error["status"]).to eq 404
          end
        end
      end
    end
  end
end
