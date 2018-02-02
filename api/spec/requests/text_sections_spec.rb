require "rails_helper"

RSpec.describe "Text Section API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:text_section) { FactoryBot.create(:text_section) }

  describe "sends a text section" do
    let(:path) { api_v1_text_section_path(text_section) }
    before(:each) { get path }
    describe "the response" do
      it "responds with a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end
end
