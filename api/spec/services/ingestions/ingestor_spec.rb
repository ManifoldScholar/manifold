require "rails_helper"

# TODO: Adjust ingestor to validate text and check ingestor outcome here.
RSpec.describe Ingestions::Ingestor do
  describe "EPUB ingestion" do
    context "when V3" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }
      let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when V2" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v2.zip") }
      let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end
  end

  describe "manifest ingestion" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "all_local.zip") }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
    let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

    it "returns a valid text" do
      expect(text.result.valid?).to eq true
    end
  end

  describe "document ingestion" do
    context "when HTML" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
      let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when Markdown" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single.zip") }
      let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when Google Doc", slow: true do

      before(:all) do
        Settings.instance.update_from_environment!
      end

      let(:path) { "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing" }
      let!(:ingestion) { FactoryBot.create :ingestion, :uningested, external_source_url: path }
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text" do
        expect(text.result.valid?).to eq true
      end
    end

    context "when Word Doc", slow: true do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "ms_word", "example.docx") }
      let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
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
      let!(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
      let!(:text) { Ingestions::Ingestor.run ingestion: ingestion }

      it "returns a valid text", odd_fs: true do
        expect(text.result.valid?).to eq true
      end
    end

    context "when reingesting a document" do
      let(:text) { FactoryBot.create(:text, title: "original") }
      let!(:userStylesheet) do
        FactoryBot.create(
          :stylesheet,
          raw_styles: ".invalid { position: relative }",
          text: text
        )
      end
      let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
      let!(:ingestion) { FactoryBot.create :ingestion, :file_source, text: text, source_path: path }

      # For document ingestions, which only have one text section,  we can always update
      # the single text section rather than create a new one.
      it "updates the existing text section, regardless of the source identifier" do
        ingestion_source = FactoryBot.create(:ingestion_source)
        text_section = FactoryBot.create(
          :text_section,
          text: text,
          ingestion_source: ingestion_source,
          source_identifier: ingestion_source.source_identifier
        )
        expect do
          described_class.run ingestion: ingestion
        end.to change { text_section.reload.updated_at }
      end

      it "Creates a new text section if a text section does not exist" do
        expect do
          described_class.run ingestion: ingestion
        end.to change { TextSection.count }.by 1
      end

      describe "a successful reingestion" do
        it "updates the existing text" do
          expect do
            described_class.run ingestion: ingestion
          end.to change { text.reload.updated_at }
        end

        it "does change the text's title" do
          expect do
            described_class.run ingestion: ingestion
          end.to change { text.reload.title }
        end

        it "does not change the text's slug" do
          expect do
            described_class.run ingestion: ingestion
          end.to_not change(text, :slug)
        end

        it "does not revalidate user stylesheets" do
          expect do
            described_class.run ingestion: ingestion
            userStylesheet.reload
          end.to_not change(userStylesheet, :styles)
        end
      end

      describe "a reingestion with failures" do
        it "does not persist updates" do
          allow_any_instance_of(Ingestions::Compilers::TextSection)
            .to receive(:text_section).and_raise(::Ingestions::IngestionError)

          expect do
            described_class.run ingestion: ingestion
          end.to_not change { text.reload.title }
        end
      end
    end
  end
end
