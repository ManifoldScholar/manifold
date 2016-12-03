require "rails_helper"

RSpec.describe "Texts API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  describe "sends a text" do
    let(:path) { api_v1_texts_path }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end
end
