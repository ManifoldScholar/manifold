# frozen_string_literal: true

RSpec.describe "OAI PMH List Sets", type: :request do
  include_context "OAI testing"
  let(:opts) { {} }

  subject(:response) { client.list_sets(opts) }

  it { is_expected.to be_an_instance_of OAI::ListSetsResponse }

  it "finds default sets" do
    expect(response.count).to eq 3 # "projects", "journals", and "directory"
  end

  context "when directory is disabled" do
    before do
      Settings.instance.oai.directory_enabled = false
      Settings.instance.save!
      ManifoldOAISet.find_by(spec: "directory")&.destroy
    end

    it "finds only projects and journals sets" do
      expect(response.count).to eq 2
      expect(response.map(&:spec)).to contain_exactly("projects", "journals")
    end
  end

  context "when there are multiple project collections" do
    let_it_be(:num_collections) { 5 }
    let_it_be(:collections) { FactoryBot.create_list :project_collection, 5 }
    it "finds a set for every project collection" do
      expect(response.count).to eq(num_collections + 3) # The "projects", "journals", and "directory" sets should always exist
    end

    it "does not find excluded collections" do
      FactoryBot.create_list :project_collection, 3, exclude_from_oai: true
      expect(response.count).to eq(num_collections + 3) # The "projects", "journals", and "directory" sets should always exist
    end
  end
end
