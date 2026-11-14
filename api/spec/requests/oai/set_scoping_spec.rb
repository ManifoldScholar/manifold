# frozen_string_literal: true

RSpec.describe "OAI PMH set scoping", type: :request do
  include_context "OAI testing"

  describe "journal and issue sets" do
    let_it_be(:journal) { FactoryBot.create(:journal) }
    let_it_be(:issues) { FactoryBot.create_list(:journal_issue, 2, journal: journal) }

    let(:journal_record) { journal.manifold_oai_record }
    let(:issue_records) { issues.map { |issue| issue.project.manifold_oai_record } }

    before do
      kept = [journal_record, *issue_records].compact.map(&:id)
      ManifoldOAIRecord.where.not(id: kept).delete_all
    end

    it "scopes a journal's issue set to its issues" do
      response = client.list_records(set: journal.manifold_oai_set.spec)

      expect(response.count).to eq 2
    end

    it "aggregates every journal's issues under the issues parent" do
      response = client.list_records(set: "issues")

      expect(response.count).to eq 2
    end

    it "keeps the journals catalog limited to journal records" do
      response = client.list_records(set: "journals")

      expect(response.count).to eq 1
    end
  end

  describe "collection and project sets" do
    let_it_be(:collection_project) { FactoryBot.create(:collection_project) }

    let(:collection) { collection_project.project_collection }
    let(:project_record) { collection_project.project.manifold_oai_record }
    let(:collection_record) { collection.manifold_oai_record }

    before do
      kept = [project_record, collection_record].compact.map(&:id)
      ManifoldOAIRecord.where.not(id: kept).delete_all
    end

    it "scopes a collection's set to its projects" do
      response = client.list_records(set: collection.manifold_oai_set.spec)

      expect(response.count).to eq 1
    end

    it "lists project collections in the projectCollections catalog" do
      response = client.list_records(set: "projectCollections")

      expect(response.count).to eq 1
    end
  end
end
