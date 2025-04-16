# frozen_string_literal: true

RSpec.describe "Project ContentBlocks API", type: :request do
  let_it_be(:project, refind: true) { FactoryBot.create(:project) }

  describe "sends a list of project content blocks" do
    let(:path) { api_v1_project_relationships_content_blocks_path(project) }

    before { 2.times { FactoryBot.create(:markdown_block, project: project) } }

    describe "the response" do
      it "has a 200 status code" do
        get path
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "creates a content block" do
    let(:path) { api_v1_project_relationships_content_blocks_path(project) }
    let(:text) { FactoryBot.create(:text, project: project) }
    let(:params) do
      {
      attributes: { type: "Content::TableOfContentsBlock", depth: 2, show_authors: false, show_text_title: true },
      relationships: { text: { data: { id: text.id, type: "texts" } } }
    }
    end

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        it "has a 201 CREATED status code" do
          post path, headers: headers, params: build_json_payload(params)
          expect(response).to have_http_status(:created)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          post path, headers: headers, params: build_json_payload(params)
          expect(response).to have_http_status(:forbidden)
        end
      end
    end
  end
end
