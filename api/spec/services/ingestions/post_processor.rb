require "rails_helper"

RSpec.describe Ingestions::PostProcessor do
  let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
  let(:ingestion) do
    ingestion = FactoryBot.create(:ingestion, text: nil)
    allow(ingestion).to receive(:ingestion_source).and_return(path)
    ingestion
  end
  let(:context) { Ingestions::Context.new(ingestion) }
  let(:manifest) { Ingestions::Strategies::Epub.run(context: context).result }
  let(:text) { Ingestions::Compiler.run(manifest: manifest, context: context).result }
  let!(:outcome) { Ingestions::PostProcessor.run(text: text, context: context) }

  describe "the text section bodies" do
    it "generates the body" do
      expect(text.text_sections.pluck(:body)).to_not include nil
    end
    it "generates the body_json" do
      expect(text.text_sections.pluck(:body_json)).to_not include nil
    end
  end

  describe "the text spine" do
    it "correctly generates a spine" do
      expect(text.spine.length).to eq 4
    end
  end

  describe "the text table of contents" do
    it "has the correct number of entries" do
      toc = text.toc
      expect(toc.length).to be 3
      expect(toc[1][:children].length).to be 1
    end

    it "has the correct labels" do
      toc = text.toc
      expect(toc.map { |i| i[:label] }).to eq ["Section 1", "Section 2", "Section 3"]
      expect(toc[1][:children][0][:label]).to eq "Section 2.a"
    end

    it "assigns a text_section ID to each item" do
      def walk(array)
        ids = []
        array.each do |hash|
          ids.push hash[:id]
          if hash.key? :children
            ids.concat walk(hash[:children])
          end
        end
        ids
      end
      expect(walk(text.toc).any? { |i| i.nil? }).to be false
    end
  end
end
