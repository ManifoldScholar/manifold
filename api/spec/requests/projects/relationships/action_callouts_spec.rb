# frozen_string_literal: true

RSpec.describe "Project ActionCallout API", type: :request do
  let(:project) { FactoryBot.create(:project) }

  describe "sends a list of project call to actions" do
    let(:path) { api_v1_project_relationships_action_callouts_path(project) }

    before(:each) { 2.times { FactoryBot.create(:action_callout, calloutable: project) } }

    describe "the response" do
      it "has a 200 status code" do
        get path
        expect(response).to have_http_status(200)
      end
    end
  end

  describe "creates an action callout" do
    let(:path) { api_v1_project_relationships_action_callouts_path(project) }
    let(:text) { FactoryBot.create(:text, project: project) }
    let(:params) { {
      attributes: { kind: "toc", title: "DO IT", location: "left" },
      relationships: { text: { data: { id: text.id, type: "texts" } } }
    } }


    context "when the user is an admin" do
      let(:headers) { admin_headers }

      describe "the response" do
        it "has a 201 CREATED status code" do
          post path, headers: headers, params: build_json_payload(params)
          expect(response).to have_http_status(201)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          post path, headers: headers, params: build_json_payload(params)
          expect(response).to have_http_status(403)
        end
      end
    end
  end
end
