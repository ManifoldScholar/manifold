# frozen_string_literal: true

RSpec.describe "OAI PMH List Records", type: :request do
  include_context "OAI testing"

  let_it_be(:old_records) { FactoryBot.create_list(:manifold_oai_record, 5, updated_at: 6.days.ago) }
  let_it_be(:new_records) { FactoryBot.create_list(:manifold_oai_record, 3, updated_at: 3.days.ago) }

  let(:opts) { {} }

  before do
    ManifoldOAIRecord.where.not(id: old_records.pluck(:id).concat(new_records.pluck(:id))).delete_all
  end

  subject(:response) { client.list_records(opts) }

  it { is_expected.to be_an_instance_of OAI::ListRecordsResponse }

  it "finds all records" do
    expect(response.count).to eq 8
  end

  context "when given filter options" do
    let(:opts) { { from: 5.days.ago, until: 2.days.ago } }

    it "only finds records between the two dates" do
      expect(response.count).to eq 3
    end
  end
end
