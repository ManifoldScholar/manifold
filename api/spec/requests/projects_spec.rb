# frozen_string_literal: true

RSpec.describe "Projects API", type: :request do
  let_it_be(:project, refind: true) { FactoryBot.create(:project, draft: false) }

  describe "responds with a list of projects" do
    before { get api_v1_projects_path, headers: reader_headers }

    describe "the response" do
      it "has a 200 status code" do
        expect(response).to have_http_status(:ok)
      end
    end

    context "when searching by keyword" do
      let_it_be(:project_foo, refind: true) { FactoryBot.create(:project, title: "foo") }

      it "has a 200 status code" do
        expect do
          path = api_v1_projects_path(params: { filter: { keyword: "foo" } })
          get path, headers: reader_headers
        end

        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET /api/v1/projects/:id" do
    let(:headers) { nil }

    shared_examples_for "finding the project" do
      context "with an existing project" do
        it "finds the project" do
          expect do
            get api_v1_project_path(project)
          end.to execute_safely

          expect(response).to have_http_status(:ok)
        end
      end

      context "when the project has been soft-deleted" do
        before do
          project.soft_delete!
        end

        it "does not find the project" do
          expect do
            get api_v1_project_path(project)
          end.to execute_safely

          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "as an admin" do
      let(:headers) { admin_headers }

      include_examples "finding the project"
    end

    context "as a reader" do
      let(:headers) { reader_headers }

      include_examples "finding the project"
    end
  end

  describe "creates a project" do
    let(:path) { api_v1_projects_path }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      it "has a 201 SUCCESS status code" do
        params = build_json_payload(attributes: { title: "foo" })
        post path, headers: headers, params: params
        expect(response).to have_http_status(:created)
      end
    end

    context "when the user is a project creator" do
      let(:headers) { project_creator_headers }

      it "creates the project and assigns the creator as an editor on the newly created project" do
        params = build_json_payload(attributes: { title: "foo" })

        expect do
          post(path, headers:, params:)
        end.to change(Project, :count).by(1)

        expect(response).to have_http_status(:created)

        project_id = response.parsed_body.dig("data", "id")
        created_project = Project.find(project_id)

        expect(project_creator).to have_role(:project_editor, created_project)
      end
    end

    context "when the user is not logged in" do
      it "has a 401 status code" do
        params = build_json_payload(attributes: { title: "foo" })
        post path, params: params
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      it "has a 403 status code" do
        params = build_json_payload(attributes: { title: "foo" })
        post path, headers: headers, params: params
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe "updates a project" do
    let(:path) { api_v1_project_path(project) }
    let(:metadata) do
      {
        "isbn" => "1234",
        "publisher" => "Someone",
        "publisherPlace" => "Somewhere",
        "containerTitle" => "The Hardy Boys"
      }
    end
    context "when the user is an admin" do
      let(:headers) { admin_headers }

      let(:john) { FactoryBot.create(:maker, first_name: "John") }
      let(:jim) { FactoryBot.create(:maker, first_name: "Jim") }
      let(:jenny) { FactoryBot.create(:maker, first_name: "Jenny") }

      describe "its creator association" do
        it("can be replaced") do
          project.creators << jenny
          params = build_json_payload(relationships: { creators: { data: [
                                        { type: "makers", id: john.id },
                                        { type: "makers", id: jim.id }
                                      ] } })
          patch path, headers: headers, params: params
          expect(project.creators.reload.pluck(:id)).to contain_exactly(john.id, jim.id)
        end
      end

      describe "its contributors" do
        it("can be replaced") do
          project.contributors << jenny
          params = build_json_payload(relationships: { contributors: { data: [
                                        { type: "makers", id: john.id },
                                        { type: "makers", id: jim.id }
                                      ] } })
          patch path, headers: headers, params: params
          expect(project.contributors.reload.pluck(:id)).to contain_exactly(john.id, jim.id)
        end
      end

      describe "its creators" do
        it("can be replaced") do
          project.creators << jenny
          params = build_json_payload(relationships: { creators: { data: [
                                        { type: "makers", id: john.id },
                                        { type: "makers", id: jim.id }
                                      ] } })
          patch path, headers: headers, params: params
          expect(project.creators.reload.pluck(:id)).to contain_exactly(jim.id, john.id)
        end
      end

      describe "its collaborators" do
        let(:john_collaborator) { FactoryBot.create(:collaborator, maker_id: john.id) }
        let(:jenny_collaborator) { FactoryBot.create(:collaborator, maker_id: jenny.id) }

        it("are sorted correctly after being set") do
          project.collaborators << jenny_collaborator
          project.collaborators << john_collaborator
          project.save
          expect(project.collaborators.pluck(:id)).to eq([jenny_collaborator.id, john_collaborator.id])
          params = build_json_payload(relationships: { collaborators: { data: [
                                        { type: "collaborator", id: john_collaborator.id },
                                        { type: "collaborator", id: jenny_collaborator.id }
                                      ] } })
          patch path, headers: headers, params: params
          expect(project.collaborators.reload.pluck(:id)).to eq([john_collaborator.id, jenny_collaborator.id])
        end
      end

      describe "the response" do
        context "body" do
          it("contains the updated title") { expect_updated_param("title", "a title") }
          it("contains the updated metadata") { expect_updated_param("metadata", metadata) }
          it("contains the updated subtitle") { expect_updated_param("subtitle", "a subtitle") }
          it("contains the updated featured boolean value") { expect_updated_param("featured", "true", true) }
          it("contains the updated hashtag") { expect_updated_param("hashtag", "the_hashtag") }
          it("contains the updated description") { expect_updated_param("description", "the description") }
          it("contains the updated tag list") { expect_updated_param("tagList", %w(rowan dog puppy), %w(rowan dog puppy)) }
          it("contains the updated exclude_from_oai value") { expect_updated_param("excludeFromOAI", "true", true) }
        end

        it "has a 200 OK status code" do
          patch path, headers: headers, params: build_json_payload
          expect(response).to have_http_status(:ok)
        end
      end
    end

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      describe "the response" do
        it "has a 403 forbidden status code" do
          patch path, headers: headers, params: build_json_payload
          expect(response).to have_http_status(:forbidden)
        end
      end
    end
  end

  describe "DELETE /api/v1/projects/:id" do
    context "as an admin" do
      it "soft-deletes the project" do
        expect do
          delete api_v1_project_path(project), headers: admin_headers
        end.to keep_the_same(Project, :count)
          .and have_enqueued_job(SoftDeletions::PurgeJob).once.with(project)

        expect(response).to have_http_status(:no_content)
      end

      context "when the project has already been soft-deleted" do
        before do
          project.async_destroy
        end

        it "is not found and skipped" do
          expect do
            delete api_v1_project_path(project), headers: admin_headers
          end.to keep_the_same(Project, :count)
            .and have_enqueued_job(SoftDeletions::PurgeJob).exactly(0).times

          expect(response).to have_http_status(:not_found)
        end
      end
    end

    context "as a reader" do
      it "does nothing" do
        expect do
          delete api_v1_project_path(project), headers: reader_headers
        end.to keep_the_same(Project, :count)
          .and have_enqueued_job(SoftDeletions::PurgeJob).exactly(0).times

        expect(response).to have_http_status :forbidden
      end
    end
  end
end
