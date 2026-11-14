# frozen_string_literal: true

RSpec.describe "OAI PMH List Sets", type: :request do
  include_context "OAI testing"
  let(:opts) { {} }

  subject(:response) { client.list_sets(opts) }

  it { is_expected.to be_an_instance_of OAI::ListSetsResponse }

  it "finds default sets" do
    expect(response.map(&:spec)).to contain_exactly("projects", "journals", "directory", "issues", "projectCollections")
  end

  it "renders setDescription as Dublin Core XML" do
    raw = Net::HTTP.get(URI("#{api_oai_url}?verb=ListSets"))
    doc = Nokogiri::XML(raw).remove_namespaces!

    descriptions = doc.xpath("//set/setDescription/dc")

    expect(descriptions).not_to be_empty
  end

  context "when directory is disabled" do
    before do
      Settings.instance.oai.directory_enabled = false
      Settings.instance.save!
      ManifoldOAISet.find_by(spec: "directory")&.destroy
    end

    it "finds only projects, journals, issues, and project collections sets" do
      expect(response.map(&:spec)).to contain_exactly("projects", "journals", "issues", "projectCollections")
    end
  end

  context "when there are multiple project collections" do
    let_it_be(:num_collections) { 5 }
    let_it_be(:collections) { FactoryBot.create_list :project_collection, 5 }

    # The "projects", "journals", "directory", "issues", and "projectCollections" sets always exist.
    let(:default_set_count) { 5 }

    it "finds a set for every project collection" do
      expect(response.count).to eq(num_collections + default_set_count)
    end

    it "names each collection set under the projects hierarchy" do
      collection_specs = response.map(&:spec).grep(/\Aprojects:/)

      expect(collection_specs.count).to eq num_collections
    end

    it "does not find excluded collections" do
      FactoryBot.create_list :project_collection, 3, exclude_from_oai: true
      expect(response.count).to eq(num_collections + default_set_count)
    end
  end
end
