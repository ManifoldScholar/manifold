# frozen_string_literal: true

RSpec.describe "My Annotations API", type: :request do
  let(:another_user) { FactoryBot.create(:user) }
  let(:text) { FactoryBot.create(:text) }
  let(:text_section) { FactoryBot.create(:text_section, text: text) }
  let(:annotation) { FactoryBot.create(:annotation, creator: reader, text_section: text_section) }

  describe "sends my annotations" do
    let(:path) { api_v1_me_relationships_annotations_path }
    let(:params) do
      { filter: { text: text.id } }
    end

    context "when the user is not authenticated" do
      before(:each) { get path }
      it "has a 401 status code" do
        expect(response).to have_http_status(401)
      end
    end

    context "when the user is a reader" do
      before(:each) do
        annotation
        get path, headers: reader_headers, params: params
      end
      let(:api_response) { JSON.parse(response.body) }

      describe "the response" do
        it "includes an array of data" do
          expect(api_response["data"]).to be_instance_of Array
        end

        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end

        it "includes meta[:annotated] stating whether the user annotated the text" do
          expect(api_response["meta"]["annotated"]).to be_in([true, false])
        end

        it "responds with meta[:annotated] being true if the user has annotated the text" do
          expect(api_response["meta"]["annotated"]).to be true
        end
      end
    end
  end
end
