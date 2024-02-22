# frozen_string_literal: true

RSpec.describe "Texts API", type: :request do
  describe "sends a list of texts" do
    let(:path) { api_v1_texts_path }
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "sends a text" do
    let(:text) { FactoryBot.create(:text) }
    let(:text_id ) { text.id }
    let(:stylesheet) { FactoryBot.create(:stylesheet, text_id: text_id) }
    let(:path) { api_v1_text_path(text) }
    let(:api_response) { JSON.parse(response.body) }

    before(:each) do
      stylesheet
      get path
    end

    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end

      it "includes the text's stylesheets" do
        text.reload
        included = api_response["included"].find_index do |inc|
          inc["id"] == stylesheet.id
        end
        expect(included).to_not be nil
      end
    end

  end

  describe "updates a text" do

    it_should_behave_like "orderable api requests" do
      let(:path) { "api_v1_text_path" }
      let!(:object_a) { FactoryBot.create(:text, position: 1) }
      let!(:object_b) { FactoryBot.create(:text, position: 2, project: object_a.project) }
    end
  end

  describe "toggling API export" do
    let!(:text) { FactoryBot.create :text, exports_as_epub_v3: false }

    it "toggles the export" do
      expect do
        put toggle_export_epub_v3_api_v1_text_path(text.id), headers: admin_headers
      end.to change { text.reload.exports_as_epub_v3? }.from(false).to(true)

      expect(response).to be_successful

      expect do
        put toggle_export_epub_v3_api_v1_text_path(text.id), headers: admin_headers
      end.to change { text.reload.exports_as_epub_v3? }.from(true).to(false)

      expect(response).to be_successful
    end
  end
end
