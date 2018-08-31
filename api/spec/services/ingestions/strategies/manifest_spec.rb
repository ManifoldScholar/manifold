require "rails_helper"

RSpec.describe Ingestions::Strategies::Manifest do
  include TestHelpers::IngestionHelper

  shared_examples "outcome assertions" do
    it "sets the ingestion type to manifest" do
      expect(context.ingestion.ingestion_type).to eq "manifest"
    end

    describe "the returned manifest" do
      describe "its text attributes" do
        it "has the correct language" do
          expect(manifest[:attributes][:metadata][:language]).to eq "language"
        end

        it "has the correct rights" do
          expect(manifest[:attributes][:metadata][:rights]).to eq "rights"
        end

        it "has the correct description" do
          expect(manifest[:attributes][:description]).to eq "description"
        end

        it "has the correct TOC" do
          expected = [
            { "label" => "Title Set From TOC", "source_path" => "section_1.html", "start_section" => true, "children" => [
              { "label" => "Section 1.1", "source_path" => "section_1_1.html", "children" => [ { "label" => "Section 1.1a", "source_path" => "section_1_1a.md" } ] }
            ] }
          ]
          expect(manifest[:attributes][:toc]).to eq expected
        end

        it "has the correct landmarks" do
          expect(manifest[:attributes][:landmarks]).to eq []
        end

        it "has the correct page list" do
          expect(manifest[:attributes][:page_list]).to eq []
        end
      end

      describe "its relationship attributes" do
        it "has the correct title attributes" do
          expected = [{ "value" => "A Manifest Ingestion", "position" => 1, "kind" => TextTitle::KIND_MAIN }]
          expect(manifest[:relationships][:text_titles]).to eq expected
        end

        it "has the correct creator attributes" do
          expected = [
            { "name" => "Rowan Ono" }
          ]
          expect(manifest[:relationships][:creators]).to eq expected
        end

        it "has the correct contributor attributes" do
          expected = [
            { "name" => "Ida Davis" }
          ]
          expect(manifest[:relationships][:contributors]).to eq expected
        end

        it "has the correct text section attributes" do
          expected = [{ "source_identifier" => "02e9b3b8b5268c3fe8bd4150fd546a55", "name" => "Title Set From TOC", "kind" => "section", "position"  => 0, "build" => "build/02e9b3b8b5268c3fe8bd4150fd546a55.html" },
                      { "source_identifier" => "9fef2b7e781641e6861d1aa79a597a57", "name" => "Section 1.1", "kind" => "section", "position" => 1, "build" => "build/9fef2b7e781641e6861d1aa79a597a57.html" },
                      { "source_identifier" => "e2fe424ecf8e3c87da127ea617e57107", "name" => "Section 1.1a", "kind" => "section", "position" => 2, "build" => "build/e2fe424ecf8e3c87da127ea617e57107.html" }]
          expect(manifest[:relationships][:text_sections]).to eq expected
        end

        it "has the correct number of ingestion sources" do
          expect(manifest[:relationships][:ingestion_sources].length).to eq 6
        end
      end
    end
  end

  context "when collection of different file kinds" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "all_local") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let!(:manifest) { described_class.run(context: context).result }

    include_examples "outcome assertions"
  end

  context "when the manifest is composed of nested, remote sources", slow: true do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "manifest", "all_remote") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { create_context(ingestion) }
    let!(:manifest) { described_class.run(context: context).result }
    it "has the correct TOC" do
      expected = [
        { "label" => "Section1", "source_path" => "2b4f3aa2fe044dbd607d21f2e949eb06.html", "start_section" => true },
        { "label" => "Section2", "source_path" => "e9e7fd64ac05018a6c9289f686581212.html", "children" => [
          { "label" => "Section2-a", "source_path" => "a6b4fe5e132fe438611f444deec4f90a.html" }
        ]}
      ]
      expect(manifest[:attributes][:toc]).to eq expected
    end

  end

end
