require "rails_helper"

RSpec.describe Ingestions::PreProcessors::AddIdsToHeaders do

  include TestHelpers::IngestionHelper

  describe "a document ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "without_headers") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let(:manifest) { Ingestions::Strategies::Document.run(context: context).result }
    let(:header_nodes) {
      described_class.run(context: context, manifest: manifest)
      doc = Nokogiri::HTML(context.read("build/index.html"), nil)
      doc.xpath("//h1 | //h2 | //h3 | //h4 | //h5 | //h6")
    }

    it "adds an ID to every header tag" do
      header_nodes.each do |node|
        expect(node["id"].blank?).to be false
      end
    end

    it "generates unique header tags, even when contents are the same" do
      ids = header_nodes.map { |node| node["id"] }
      expect(ids.uniq.length).to eq ids.length
    end

  end

end
