# frozen_string_literal: true

RSpec.describe "Texts API", type: :request do
  describe "sends a list of texts" do
    let(:path) { api_v1_texts_path }
    before { get path }

    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET /api/v1/texts/:id" do
    let_it_be(:text, refind: true) { FactoryBot.create(:text) }
    let_it_be(:stylesheet, refind: true) { FactoryBot.create(:stylesheet, text: text) }

    context "with an existing text" do
      it "finds the text and includes the stylesheet" do
        expect do
          get api_v1_text_path text
        end.to execute_safely

        expect(response).to have_http_status :ok

        expect(response.parsed_body).to satisfy("include the stylesheet") do |api_response|
          included_index = api_response["included"].find_index do |inc|
            inc["id"] == stylesheet.id
          end

          included_index.present?
        end
      end
    end

    context "with a soft-deleted text" do
      before do
        text.soft_delete!
      end

      it "does not find the text" do
        expect do
          get api_v1_text_path text
        end.to execute_safely

        expect(response).to have_http_status :not_found
      end
    end
  end

  describe "updates a text" do
    it_behaves_like "orderable api requests" do
      let(:path) { "api_v1_text_path" }
      let!(:object_a) { FactoryBot.create(:text, position: 1) }
      let!(:object_b) { FactoryBot.create(:text, position: 2, project: object_a.project) }
    end
  end

  describe "DELETE /api/v1/texts/:id" do
    let_it_be(:text, refind: true) { FactoryBot.create(:text) }

    context "as an admin" do
      it "soft-deletes the text" do
        expect do
          delete api_v1_text_path(text), headers: admin_headers
        end.to keep_the_same(Text, :count)
          .and have_enqueued_job(SoftDeletions::PurgeJob).once.with(text)

        expect(response).to have_http_status :no_content
      end
    end

    context "as a reader" do
      it "does nothing" do
        expect do
          delete api_v1_text_path(text), headers: reader_headers
        end.to keep_the_same(Text, :count)
          .and have_enqueued_job(SoftDeletions::PurgeJob).exactly(0).times

        expect(response).to have_http_status :forbidden
      end
    end
  end

  describe "toggling API export" do
    let_it_be(:text, refind: true) { FactoryBot.create :text, exports_as_epub_v3: false }

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
