require "rails_helper"

# TODO: Adjust ingestor to validate text and check ingestor outcome here.
RSpec.describe Ingestions::Ingestor do
  describe "EPUB ingestion" do
    context "when V3" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when V2" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v2.zip") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end
  end

  describe "manifest ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "all_local") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

    it "returns a valid text" do
      expect(text.result.valid?).to eq true
    end
  end

  describe "document ingestion" do
    context "when HTML" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        allow(ingestion).to receive(:source_file_name).and_return("index.html")
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when Markdown" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when Google Doc", slow: true do
      let(:path) { "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing" }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when Word Doc", slow: true do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "ms_word", "example.docx") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run(ingestion: ingestion).result }

      it "returns a valid text" do
        expect(text.valid?).to eq true
      end

      it "correctly references text sections in the toc" do
        expect(text.toc[0][:id]).to eq text.text_sections.first.id
      end
    end

    context "when source has extraneous files and complex paths" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "badly_named_sources.zip") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when reingesting" do
      let(:text) { FactoryBot.create(:text, title: "original") }
      let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: text)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        allow(ingestion).to receive(:source_file_name).and_return("index.html")
        ingestion
      end

      describe "a successful reingestion" do
        it "updates the existing text" do
          expect do
            described_class.run ingestion: ingestion
          end.to change(text, :updated_at)
        end

        it "does change the text's title" do
          expect do
            described_class.run ingestion: ingestion
          end.to_not change(text, :title)
        end

        it "does not change the text's slug" do
          expect do
            described_class.run ingestion: ingestion
          end.to_not change(text, :slug)
        end
      end

      describe "a reingestion with failures" do
        it "does not persist updates" do
          allow_any_instance_of(Ingestions::Compilers::TextSection)
            .to receive(:text_section).and_raise(::Ingestions::IngestionError)

          expect do
            described_class.run ingestion: ingestion
          end.to_not change(text, :title)
        end
      end
    end
  end
end
