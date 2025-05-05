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
      let(:path) { api_v1_annotation_path(annotation) }

      it "renders successfully" do
        expect do
          get path, headers: admin_headers
        end.to execute_safely

        expect(response).to have_http_status(200)
      end
    end

    describe "destroys an annotation" do
      let(:annotation) { FactoryBot.create(:annotation, creator: reader) }
      let(:path) { api_v1_annotation_path(annotation) }
      let(:other_author_annotation) { FactoryBot.create(:annotation, creator: author) }
      let(:other_path) { api_v1_annotation_path(other_author_annotation) }

      context "when the user is the author of the annotation" do
        describe "the response" do
          it "has a 204 NO CONTENT status code" do
            delete path, headers: reader_headers
            expect(response).to have_http_status(204)
          end
        end
      end
      context "when the user is not the author of the annotation" do
        describe "the response" do
          it "has a 403 FORBIDDEN status code" do
            delete other_path, headers: reader_headers
            expect(response).to have_http_status(403)
          end
        end
      end
      context "when the user is an admin" do
        describe "the response" do
          it "has a 204 NO CONTENT status code" do
            delete path, headers: admin_headers
            expect(response).to have_http_status(204)
          end
        end
      end
    end

  end
end
