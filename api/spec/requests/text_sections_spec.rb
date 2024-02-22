# frozen_string_literal: true

RSpec.describe "Text Section API", type: :request do
  let!(:text) { FactoryBot.create(:text) }
  let!(:text_section) { FactoryBot.create(:text_section) }

  describe "sends a text section" do
    let(:path) { api_v1_text_relationships_text_sections_path(text_id: text.id, id: text_section.id) }
    before(:each) { get path }
    describe "the response" do
      it "responds with a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end
end
