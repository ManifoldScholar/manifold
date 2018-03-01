require "rails_helper"

RSpec.describe "Project Permissions API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")
  let(:project) { FactoryBot.create(:project) }
  let(:user) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
  let(:params) { json_payload({ attributes: { role_names: [Role::ROLE_PROJECT_EDITOR] }, relationships: { user: { data: { id: user.id, type: 'users' } } } }) }

  describe "sends a list of project permissions" do
    let(:path) { api_v1_project_relationships_permissions_path(project) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }
      describe "the response" do
        it "has a 200 status code" do
          get path, headers: headers
          expect(response).to have_http_status(200)
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
      user.add_role Role::ROLE_PROJECT_AUTHOR, project
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
      user.add_role Role::ROLE_PROJECT_AUTHOR, project
      @permission = Permission.fetch(project, user)
      @path = api_v1_project_relationships_permission_path(project, @permission)
    end
    let(:valid_params) { json_payload(attributes: { role_names: [Role::ROLE_PROJECT_EDITOR, Role::ROLE_PROJECT_AUTHOR] }) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "has a 200 SUCCESS status code" do
        put @path, headers: headers, params: valid_params
        expect(response).to have_http_status(200)
      end

      it "updates a permission successfully" do
        put @path, headers: headers, params: valid_params
        @permission.reload
        expect(@permission.role_names).to include Role::ROLE_PROJECT_EDITOR, Role::ROLE_PROJECT_AUTHOR
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
      user.add_role Role::ROLE_PROJECT_AUTHOR, project
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
        expect{
          delete @path, headers: headers
        }.to change{Permission.count}.by(-1)
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
