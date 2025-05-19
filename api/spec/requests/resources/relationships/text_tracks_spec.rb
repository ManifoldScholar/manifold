RSpec.describe "Text Tracks API", type: :request do
  let!(:project) { FactoryBot.create(:project) }
  let!(:resource) { FactoryBot.create(:resource, project: project) }
  let!(:text_track) { FactoryBot.create(:text_track, resource: resource) }

  let(:attributes) do
    {
      kind: :captions,
      srclang: "es",
      label: "Spanish",
    }
  end
  let(:params) do
    {
      data: {
        type: "text_tracks",
        attributes: attributes
      }
    }.to_json
  end

  base_path = "/api/v1/resources/:resource_id/relationships/text_tracks"

  let(:path) { api_v1_resource_relationships_text_tracks_path(resource_id: resource.id) }
  let(:track_path) { api_v1_resource_relationships_text_track_path(resource_id: resource.id, id: text_track.id) }

  describe "GET #{base_path}" do
    it "returns a list of text tracks" do
      get path
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET #{base_path}/text_track_id" do
    it "returns a text track" do
      get path
      expect(response).to have_http_status(:ok)
    end
  end

  describe "POST #{base_path}" do
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "creates a text track" do
        expect {
          post path, headers: headers, params: params
        }.to change(TextTrack, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      it "it does not create a text track" do
        expect {
          post path, headers: headers, params: params
        }.to keep_the_same(TextTrack, :count)
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "PATCH #{base_path}/:id" do
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "updates a text track" do
        patch track_path, headers: headers, params: params
        expect(response).to have_http_status(:ok)
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      it "it does not update a text track" do
        expect {
          post path, headers: headers, params: params
        }.to keep_the_same(text_track, :label)
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "DELETE #{base_path}/:id" do
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "deletes a text track" do
        expect {
          delete track_path, headers: headers
        }.to change(TextTrack, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      it "it does not delete a text track" do
        expect {
          post path, headers: headers, params: params
        }.to keep_the_same(TextTrack, :count)
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
