# frozen_string_literal: true

RSpec.describe "OAI PMH Get Record", type: :request do
  include_context "OAI testing"

  let!(:records) { FactoryBot.create_list(:manifold_oai_record, 5) }
  let(:opts) { { identifier: records.first.id } }
  subject(:response) { client.get_record(opts) }

  it { is_expected.to be_an_instance_of OAI::GetRecordResponse }

  it "finds the correct record" do
    expect(response.record.header.identifier).to eq "oai:manifold:#{records.first.id}"
  end
end
