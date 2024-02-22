# frozen_string_literal: true

RSpec.describe "Events API", type: :request do
  let(:event) { FactoryBot.create(:event) }

  describe "destroys an event" do

    let(:path) { api_v1_event_path(event) }

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
end
