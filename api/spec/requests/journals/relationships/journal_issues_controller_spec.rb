# frozen_string_literal: true

RSpec.describe "Journal JournalIssues API", type: :request do
  let_it_be(:journal, refind: true) { FactoryBot.create(:journal) }
  let_it_be(:project, refind: true) { FactoryBot.create(:project) }

  describe "creates a journal issue" do
    let(:path) { api_v1_journal_relationships_journal_issues_path(journal) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      context "when a project is provided that the user can update" do
        let(:params) do
          {
            attributes: { number: 1 },
            relationships: {
              project: {
                data: {
                  id: project.id,
                  type: "projects"
                }
              }
            }
          }
        end

        it "creates an issue with the existing project" do
          expect do
            post path, headers: headers, params: build_json_payload(params)
          end.to change(JournalIssue, :count).by(1)
            .and keep_the_same(Project, :count)

          expect(response).to have_http_status(201)
        end
      end

      context "when no project is provided" do
        let(:params) do
          {
            attributes: { number: "1", pendingSlug: "test" }
          }
        end

        it "creates an issue AND a project" do
          expect do
            post path, headers: headers, params: build_json_payload(params)
          end.to change(JournalIssue, :count).by(1)
            .and change(Project, :count).by(1)

          expect(response).to have_http_status(201)
        end
      end
    end

    context "when the user is a journal editor" do
      let_it_be(:journal_editor, refind: true) { FactoryBot.create :user }

      let!(:headers) { build_headers_for journal_editor }

      before do
        journal_editor.add_role :journal_editor, journal
      end

      context "when a project is provided that the user can't update" do
        let(:params) do
          {
            attributes: { number: 1 },
            relationships: {
              project: {
                data: {
                  id: project.id,
                  type: "projects"
                }
              }
            }
          }
        end

        it "does not create an issue" do
          expect do
            post path, headers: headers, params: build_json_payload(params)
          end.to keep_the_same(JournalIssue, :count)
            .and keep_the_same(Project, :count)

          expect(response).to have_http_status(403)
        end
      end

      context "when no project is provided" do
        let(:params) do
          {
            attributes: { number: "1", pendingSlug: "test" }
          }
        end

        it "creates an issue and a project" do
          expect do
            post path, headers: headers, params: build_json_payload(params)
          end.to change(JournalIssue, :count).by(1)
            .and change(Project, :count).by(1)

          expect(response).to have_http_status(201)
        end
      end
    end
  end
end
