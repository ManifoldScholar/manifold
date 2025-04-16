# frozen_string_literal: true

RSpec.describe "My Reading Groups API", type: :request do
  let(:another_user) { FactoryBot.create(:user) }

  describe "sends my reading groups" do
    let(:path) { api_v1_me_relationships_reading_groups_path }

    context "when the user is not authenticated" do
      before { get path }

      it "has a 200 status code" do
        expect(response).to have_http_status(:ok)
      end
    end

    context "when the user is a reader" do
      before do
        get path, headers: reader_headers
      end

      let(:api_response) { response.parsed_body }

      describe "the response" do
        it "includes an array of data" do
          expect(api_response["data"]).to be_instance_of Array
        end

        it "has a 200 status code" do
          expect(response).to have_http_status(:ok)
        end
      end
    end
  end
end
