require "rails_helper"

RSpec.describe "Journal JournalIssues API", type: :request do
  include_context("authenticated request")
  include_context("param helpers")

  let(:journal) { FactoryBot.create(:journal) }

  describe "creates a journal issue" do
    let(:path) { api_v1_journal_relationships_journal_issues_path(journal) }

    context "when the user is an admin" do
      let(:headers) { admin_headers }

      context "when a project is provided" do
        let(:project) { FactoryBot.create(:project) }
        let(:params) {
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
        }

        describe "the response" do
          it "has a 201 CREATED status code" do
            post path, headers: headers, params: build_json_payload(params)
            expect(response).to have_http_status(201)
          end
        end
      end

      context "when no project is provided" do
        let(:params) {
          {
            attributes: { number: 1 }
          }
        }

        describe "the response" do
          it "has a 201 CREATED status code" do
            post path, headers: headers, params: build_json_payload(params)
            expect(response).to have_http_status(201)
          end
        end
      end

    end
  end
end
