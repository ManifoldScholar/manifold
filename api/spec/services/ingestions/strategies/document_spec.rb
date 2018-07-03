require "rails_helper"

RSpec.describe Ingestions::Strategies::Document do
  shared_examples "outcome assertions" do
    it "sets the ingestion type to document" do
      expect(context.ingestion.ingestion_type).to eq "document"
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

        it "has an empty TOC" do
          expect(manifest[:attributes][:toc]).to eq []
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
          expected = [{ "value" => "title", "position" => 1, "kind" => TextTitle::KIND_MAIN }]
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
      end
    end
  end

  context "when HTML file" do
    context "when single HTML page" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }
      let(:ingestion) do
        ingestion = FactoryBot.create(:ingestion, text: nil)
        allow(ingestion).to receive(:ingestion_source).and_return(path)
        ingestion
      end
      let(:context) { Ingestions::Context.new(ingestion) }
      let!(:manifest) { described_class.run(context: context).result }

      include_examples "outcome assertions"

      it "has the correct text section attributes" do
        expected = [{ "source_identifier" => "index.html", "name" => "title", "kind" => "section", "position" => 1, "build" => "build/index.html" }]
        expect(manifest[:relationships][:text_sections]).to eq expected
      end

      it "has the correct number of stylesheets" do
        expect(manifest[:relationships][:stylesheets].length).to eq 1
      end

      it "has the correct number of ingestion sources" do
        expect(manifest[:relationships][:ingestion_sources].length).to eq 1
      end
    end

    context "when HTML page with external stylesheet" do
      context "when ZIP" do
        let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal.zip") }
        let(:ingestion) do
          ingestion = FactoryBot.create(:ingestion, text: nil)
          allow(ingestion).to receive(:ingestion_source).and_return(path)
          ingestion
        end
        let(:context) { Ingestions::Context.new(ingestion) }
        let!(:manifest) { described_class.run(context: context).result }

        include_examples "outcome assertions"

        it "has the correct text section attributes" do
          expected = [{ "source_identifier" => "index.html", "name" => "title", "kind" => "section", "position" => 1, "build" => "build/index.html" }]
          expect(manifest[:relationships][:text_sections]).to eq expected
        end

        it "has the correct stylesheet attributes" do
          expected = [
            { "source_identifier" => "a-stylesheet.css", "name" => "stylesheet-1", "position" => 1, "build" => "build/stylesheet-1.css" },
            { "source_identifier" => nil, "name" => "head-2", "position" => 2, "build" => "build/head-2.css" }
          ]
          expect(manifest[:relationships][:stylesheets]).to eq expected
        end

        it "has the correct number of ingestion sources" do
          expect(manifest[:relationships][:ingestion_sources].length).to eq 2
        end
      end

      context "when dir" do
        let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal") }
        let(:ingestion) do
          ingestion = FactoryBot.create(:ingestion, text: nil)
          allow(ingestion).to receive(:ingestion_source).and_return(path)
          ingestion
        end
        let(:context) { Ingestions::Context.new(ingestion) }
        let!(:manifest) { described_class.run(context: context).result }

        include_examples "outcome assertions"

        it "has the correct text section attributes" do
          expected = [{ "source_identifier" => "index.html", "name" => "title", "kind" => "section", "position" => 1, "build" => "build/index.html" }]
          expect(manifest[:relationships][:text_sections]).to eq expected
        end

        it "has the correct stylesheet attributes" do
          expected = [
            { "source_identifier" => "a-stylesheet.css", "name" => "stylesheet-1", "position" => 1, "build" => "build/stylesheet-1.css" },
            { "source_identifier" => nil ,"name" => "head-2", "position" => 2, "build" => "build/head-2.css" }
          ]
          expect(manifest[:relationships][:stylesheets]).to eq expected
        end

        it "has the correct number of ingestion sources" do
          expect(manifest[:relationships][:ingestion_sources].length).to eq 2
        end
      end
    end
  end

  context "when markdown file" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single", "minimal-single.md") }
    let(:ingestion) do
      ingestion = FactoryBot.create(:ingestion, text: nil)
      allow(ingestion).to receive(:ingestion_source).and_return(path)
      ingestion
    end
    let(:context) { Ingestions::Context.new(ingestion) }
    let!(:manifest) { described_class.run(context: context).result }

    include_examples "outcome assertions"
  end

  context "when google doc", slow: true do

    before(:all) do
      url = "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing"
      @ingestion = FactoryBot.create(:ingestion, external_source_url: url)
      WebMock.allow_net_connect!
      @context = Ingestions::Context.new(@ingestion)
      WebMock.disable_net_connect!
      @manifest = described_class.run(context: @context).result
    end

    it "has the correct title attributes" do
      expected = [{ "value" => "Google Doc Prime", "position" => 1, "kind" => TextTitle::KIND_MAIN }]
      expect(manifest[:relationships][:text_titles]).to eq expected
    end

    it "has the correct text section attributes" do
      expected = [{"source_identifier"=>"GoogleDocPrime.html", "name"=>"Google Doc Prime", "kind"=>"section", "position"=>1, "build"=>"build/GoogleDocPrime.html"}]
      expect(@manifest[:relationships][:text_sections]).to eq expected
    end

    it "has the correct number of stylesheets" do
      expect(@manifest[:relationships][:stylesheets].length).to eq 1
    end

    it "has the correct number of ingestion sources" do
      expect(@manifest[:relationships][:ingestion_sources].length).to eq 2
    end

  end

end
