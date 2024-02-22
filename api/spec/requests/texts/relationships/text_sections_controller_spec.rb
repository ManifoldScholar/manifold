# frozen_string_literal: true

RSpec.describe "Text Text Sections API", type: :request do
  let(:text) { FactoryBot.create(:text) }
  let(:path) { api_v1_text_relationships_text_sections_path(text) }

  describe "sends text text sections" do
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end
end
