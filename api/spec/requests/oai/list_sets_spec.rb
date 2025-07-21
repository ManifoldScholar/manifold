# frozen_string_literal: true

RSpec.describe "OAI PMH List Sets", type: :request do
  include_context "OAI testing"
  let(:opts) { {} }

  subject(:response) { client.list_sets(opts) }

  it { is_expected.to be_an_instance_of OAI::ListSetsResponse }

  it "finds default sets" do
    expect(response.count).to eq 1
  end

  context "when there are multiple project collections" do
    let_it_be(:num_collections) { 5 }
    let_it_be(:collections) { FactoryBot.create_list :project_collection, 5 }
    it "finds a set for every project collection" do
      expect(response.count).to eq(num_collections + 1) # The "projects" set should always exist
    end
  end
end
