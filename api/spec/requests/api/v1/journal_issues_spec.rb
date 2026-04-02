# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "JournalIssues", type: :request do
  path "/journal_issues/{id}" do
    it_behaves_like "an API show request", model: JournalIssue
    it_behaves_like "an API update request", model: JournalIssue, authorized_user: :admin
    it_behaves_like "an API destroy request", model: JournalIssue, authorized_user: :admin
  end

  path "/journal_issues" do
    it_behaves_like "an API index request", model: JournalIssue
  end

  describe "for a journal" do
    let(:parent) { FactoryBot.create(:journal) }
    let(:project) { FactoryBot.create(:project) }
    let(:journal_volume) { FactoryBot.create(:journal_volume) }
    let(:journal_id) { parent.id }

    path "/journals/{journal_id}/relationships/journal_issues" do
      it_behaves_like "an API index request", parent: "journal", model: JournalIssue, resource_name: "journal_issue", url_parameters: [:journal_id]
      it_behaves_like "an API create request", parent: "journal", model: JournalIssue, resource_name: "journal_issue", url_parameters: [:journal_id], authorized_user: :admin, included_relationships: [:project] do
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
