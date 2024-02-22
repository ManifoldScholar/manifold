# frozen_string_literal: true

RSpec.describe "Stylesheets API", type: :request do
  let(:attributes) do
    {
      name: "Rambo Stylez",
      rawStyles: ".some-class {\n    font-weight: bold;\n}",
      position: 1
    }
  end

  let(:valid_params) do
    build_json_payload(attributes: attributes)
  end

  let_it_be(:text, refind: true) { FactoryBot.create(:text) }

  describe "creates an stylesheet" do
    let(:path) { api_v1_text_relationships_stylesheets_path(text) }
    let(:api_response) { JSON.parse(response.body) }

    before(:each) do
      post path, headers: admin_headers, params: valid_params
    end

    it "sets the creator correctly" do
      stylesheet = Stylesheet.find api_response["data"]["id"]
      expect(stylesheet.creator.id).to eq(admin.id)
    end

    it "sets the name correctly" do
      expect(api_response["data"]["attributes"]["name"]).to eq(attributes[:name])
    end

    it "sets the raw styles correctly" do
      expect(api_response["data"]["attributes"]["rawStyles"]).to eq(attributes[:rawStyles])
    end

  end

  describe "updates a stylesheet" do
    let(:stylesheet) { FactoryBot.create(:stylesheet, text: text, creator: admin)}
    let(:api_response) { JSON.parse(response.body) }

    it "updates the name attribute" do
      valid_params = build_json_payload(attributes: { name: "Rambo Stoolz"})
      put api_v1_stylesheet_path(stylesheet.id), headers: admin_headers, params: valid_params
      expect(api_response["data"]["attributes"]["name"]).to eq("Rambo Stoolz")
    end

    describe "updates a text" do

      it_should_behave_like "orderable api requests" do
        let(:path) { "api_v1_stylesheet_path" }
        let!(:object_a) { FactoryBot.create(:stylesheet, position: 1) }
        let!(:object_b) { FactoryBot.create(:stylesheet, position: 2, text: object_a.text) }
      end
    end
  end

  describe "destroys a stylesheet" do
    let(:stylesheet) { FactoryBot.create(:stylesheet, text: text, creator: admin, position: 1) }
    let(:path) { api_v1_stylesheet_path(stylesheet) }

    context "when the user is an admin" do

      let(:headers) { admin_headers }

      it "has a 204 NO CONTENT status code" do
        delete path, headers: headers
        expect(response).to have_http_status(204)
      end
    end

    context "when the user is a reader" do

      let(:headers) { reader_headers }

      it "has a 403 FORBIDDEN status code" do
        delete path, headers: headers
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "sends a single stylesheet" do
    let(:stylesheet) { FactoryBot.create(:stylesheet, text: text, creator: admin, position: 1) }
    let(:path) { api_v1_stylesheet_path(stylesheet) }

    context "when the user is an reader" do
      before(:each) { get path, headers: reader_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is an admin" do
      before(:each) { get path, headers: admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end
      end
    end
  end
end
