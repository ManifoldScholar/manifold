# frozen_string_literal: true

RSpec.describe "OAI PMH List Records", type: :request do
  include_context "OAI testing"

  let_it_be(:records) { FactoryBot.create_list(:project, 8, :with_metadata).map(&:manifold_oai_record) }

  let(:opts) { {} }

  subject(:response) { client.list_records(opts) }

  before do
    ManifoldOAIRecord.where.not(id: records.pluck(:id)).delete_all
  end

  it { is_expected.to be_an_instance_of OAI::ListRecordsResponse }

  it "finds all records" do
    expect(response.count).to eq 8
  end

  context "when given filter options" do
    let(:opts) { { from: 5.days.ago, until: 2.days.ago } }

    before do
      ManifoldOAIRecord.limit(3).update_all(updated_at: 4.days.ago)
    end

    it "only finds records between the two dates" do
      expect(response.count).to eq 3
    end
  end

  context "when part of a set" do
    let(:opts) { { set: "projects" } }

    before do
      ManifoldOAIRecord.limit(3).each { |r| r.sets = [] }
    end

    it "finds all projects" do
      expect(response.count).to eq 5
    end
  end

  context "When the set is a project collection" do
    let(:collection_project) { FactoryBot.create(:collection_project) }
    let(:opts) { { set: collection_project.project_collection.manifold_oai_set.spec } }

    it "finds the expected project" do
      expect(response.count).to eq 1
    end

    it "does not find the expected record when the link is deleted" do
      collection_project.destroy!

      expect do
        client.list_records(opts)
      end.to raise_error(OAI::NoMatchException)
    end
  end
end
