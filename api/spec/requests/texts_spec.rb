require "rails_helper"

RSpec.describe "Texts API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

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
    let(:text) { FactoryGirl.create(:text) }
    let(:text_id ) { text.id }
    let(:stylesheet) { FactoryGirl.create(:stylesheet, text_id: text_id) }
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


end
