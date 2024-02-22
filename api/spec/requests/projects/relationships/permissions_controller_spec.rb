# frozen_string_literal: true

RSpec.describe "Project Permissions API", type: :request do
  let_it_be(:project, refind: true) { FactoryBot.create(:project) }
  let_it_be(:user, refind: true) { FactoryBot.create(:user, :editor) }

  let(:params) { build_json_payload(attributes: { role_names: %w[project_editor] }, relationships: { user: { data: { id: user.id, type: "users" } } }) }

  describe "sends a list of project permissions" do
    let(:path) { api_v1_project_relationships_permissions_path(project) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          get path, headers: headers
          expect(response).to have_http_status(200)
        end

        it "has a data attribute" do
          get path, headers: headers
          api_response = JSON.parse(response.body)
          expect(api_response).to be_a Hash
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          get path, headers: headers
          expect(response).to have_http_status(403)
        end
      end
    end
  end

  describe "sends a single project permission query" do
    before(:each) do
      user.add_role :project_author, project
      permission = Permission.fetch(project, user)
      @path = api_v1_project_relationships_permission_path(project, permission)
    end

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          get @path, headers: headers
          expect(response).to have_http_status(200)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          get @path, headers: headers
          expect(response).to have_http_status(403)
        end
      end
    end
  end

  describe "creates a project permission" do
    let(:path) { api_v1_project_relationships_permissions_path(project) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      describe "the response" do
        it "has a 201 CREATED status code" do
          post path, headers: headers, params: params
          expect(response).to have_http_status(201)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      describe "the response" do
        it "has a 403 FORBIDDEN status code" do
          post path, headers: headers, params: params
          expect(response).to have_http_status(403)
        end
      end
    end
  end

  describe "updates a project permission" do
    before(:each) do
      user.add_role :project_author, project
      @permission = Permission.fetch(project, user)
      @path = api_v1_project_relationships_permission_path(project, @permission)
    end
    let(:valid_params) { build_json_payload(attributes: { role_names: %w[project_editor project_author] }) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "has a 200 SUCCESS status code" do
        put @path, headers: headers, params: valid_params
        expect(response).to have_http_status(200)
      end

      it "updates a permission successfully" do
        put @path, headers: headers, params: valid_params
        @permission.reload
        expect(@permission.role_names).to include "project_editor", "project_author"
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      it "has a 403 FORBIDDEN status code" do
        put @path, headers: headers, params: valid_params
        expect(response).to have_http_status(403)
      end
    end
  end

  describe "destroys a project permission" do
    before(:each) do
      user.add_role :project_author, project
      @permission = Permission.fetch(project, user)
      @path = api_v1_project_relationships_permission_path(project, @permission)
    end

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "has a 204 NO CONTENT status code" do
        delete @path, headers: headers
        expect(response).to have_http_status(204)
      end

      it "destroys a permission successfully" do
        expect do
          delete @path, headers: headers
        end.to change { Permission.count }.by(-1)
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }
      it "has a 403 FORBIDDEN status code" do
        delete @path, headers: headers
        expect(response).to have_http_status(403)
      end
    end
  end
end
