# frozen_string_literal: true

RSpec.describe "Annotations API", type: :request do
  context "when fetching annotations" do
    let(:filter) do { page: { number: 1, size: 10 } } end
    let(:params) do { filter: filter } end
    let(:path) { api_v1_annotations_path }

    let(:annotations) do
      FactoryBot.create_list :annotation, 3
    end

    it "renders successfully" do
      expect do
        get path, headers: admin_headers, params: params
      end.to execute_safely

      expect(response).to have_http_status(200)
    end

    context "when fetching an annotation detail" do
      let(:annotation) { FactoryBot.create(:annotation) }
      let(:path) { api_v1_annotations_path(annotation) }

      it "renders successfully" do
        expect do
          get path, headers: admin_headers
        end.to execute_safely

        expect(response).to have_http_status(200)
      end
    end

  end
end
