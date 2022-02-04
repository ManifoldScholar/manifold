require "swagger_helper"

RSpec.describe "JournalIssues", type: :request do
  path "/journal_issues/{id}" do
    include_examples "an API show request", model: JournalIssue
    include_examples "an API update request", model: JournalIssue, authorized_user: :admin
    include_examples "an API destroy request", model: JournalIssue, authorized_user: :admin
  end

  path "/journal_issues" do
    include_examples "an API index request", model: JournalIssue
  end

  describe "for a journal" do
    let(:parent) { FactoryBot.create(:journal) }
    let(:project) { FactoryBot.create(:project) }
    let(:journal_volume) { FactoryBot.create(:journal_volume) }
    let(:journal_id) { parent.id }

    path "/journals/{journal_id}/relationships/journal_issues" do
      include_examples "an API index request", parent: "journal", model: JournalIssue, resource_name: "journal_issue", url_parameters: [:journal_id]
      include_examples "an API create request", parent: "journal", model: JournalIssue, resource_name: "journal_issue", url_parameters: [:journal_id], authorized_user: :admin, included_relationships: [:project] do
        let(:body) do
          {
            data: {
              attributes: FactoryBot.attributes_for(:journal_issue),
              relationships: {
                project: {
                  data: {
                    id: project.id,
                    type: "projects"
                  }
                },
                journal_volume: {
                  data: {
                    id: journal_volume.id,
                    type: "journal_volumes"
                  }
                }
              }
            }
          }
        end
      end
    end

  end
end
