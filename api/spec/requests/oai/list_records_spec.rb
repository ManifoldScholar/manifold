# frozen_string_literal: true

RSpec.describe "OAI PMH List Records", type: :request do
  include_context "OAI testing"

  let(:opts) { {} }
  subject(:response) { client.list_records(opts) }

  before do
    FactoryBot.create_list(:project, 5, :with_metadata)
  end

  it { is_expected.to be_an_instance_of OAI::ListRecordsResponse }

  it "finds all records" do
    expect(response.count).to be 6
  end

  describe "when given filter options" do
    let(:opts) { { from: 5.days.ago, until: 2.days.ago } }
    before do
      FactoryBot.create_list(:manifold_oai_record, 5, updated_at: 6.days.ago)
      FactoryBot.create_list(:manifold_oai_record, 3, updated_at: 3.days.ago)
    end

    it "only finds records between the two dates" do
      expect(response.count).to be 3
    end
  end
end
