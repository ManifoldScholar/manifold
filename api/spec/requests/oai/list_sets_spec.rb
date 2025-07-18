# frozen_string_literal: true

RSpec.describe "OAI PMH List Sets", type: :request do
  include_context "OAI testing"
  let(:opts) { {} }

  subject(:response) { client.list_sets(opts) }

  it { is_expected.to be_an_instance_of OAI::ListSetsResponse }

  it "finds default sets" do
    expect(response.count).to eq 1
  end
end
