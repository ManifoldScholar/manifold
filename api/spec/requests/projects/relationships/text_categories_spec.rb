# frozen_string_literal: true

RSpec.describe "Project Text Categories API", type: :request do
  let_it_be(:project, refind: true) { FactoryBot.create(:project) }
  let_it_be(:text_category, refind: true) { FactoryBot.create(:category, project: project) }

  let(:path) { api_v1_project_relationships_text_categories_path(project) }

  describe "sends project text categories" do
    before(:each) { get path }
    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "creates a new project text category" do
    let(:post_model) { { attributes: { title: "A new hope" } } }

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      before(:each) { post path, headers: headers, params: build_json_payload(post_model) }

      describe "the response" do
        it "has a 201 CREATED status code" do
          expect(response).to have_http_status(201)
        end
      end
    end

    context "when the user is an reader" do
      let(:headers) { reader_headers }
      before(:each) { post path, headers: headers, params: build_json_payload(post_model) }

      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          expect(response).to have_http_status(403)
        end
      end
    end
  end
end
