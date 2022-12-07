require "rails_helper"

RSpec.describe Ingestions::Strategies::Document do
  include TestHelpers::IngestionHelper

  let(:path) { nil }
  let(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let(:context) { create_context(ingestion) }
  let!(:manifest) { described_class.run(context: context).result }

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

        it "has no landmarks" do
          expect(manifest[:attributes][:landmarks]).to eq []
        end

        it "has an empty page list" do
          expect(manifest[:attributes][:page_list]).to eq []
        end
      end

      describe "its relationship attributes" do
        it "has one main title" do
          expected = [{ "value" => "title", "position" => 1, "kind" => TextTitle::KIND_MAIN }]
          expect(manifest[:relationships][:text_titles]).to eq expected
        end

        it "has one creator for every unique creator name" do
          expected = [
            { "name" => "Rowan Ono" }
          ]
          expect(manifest[:relationships][:creators]).to eq expected
        end

        it "has one contributor for every unique contributor name" do
          expected = [
            { "name" => "Ida Davis" }
          ]
          expect(manifest[:relationships][:contributors]).to eq expected
        end
      end
    end
  end

  context "when structured HTML file" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "structured", "index.html") }
    let(:toc) {
      [{"label"=>"Header 0",
        "anchor"=>"header-0",
        "source_path"=>"index.html",
        "children"=>[]
       },
        {"label"=>"Header 1",
        "anchor"=>"header-1",
        "source_path"=>"index.html",
        "children"=>
          [{"label"=>"Header 1.1",
            "anchor"=>"header-1-1",
            "source_path"=>"index.html",
            "children"=>[]},
           {"label"=>"Header 1.2",
            "anchor"=>"header-1-2",
            "source_path"=>"index.html",
            "children"=>
              [{"label"=>"Header 1.2.1",
                "anchor"=>"header-1-2-1",
                "source_path"=>"index.html",
                "children"=>
                  [{"label"=>"Header 1.2.1.1",
                    "anchor"=>"header-1-2-1-1",
                    "source_path"=>"index.html",
                    "children"=>[]},
                   {"label"=>"Header 1.2.1.2",
                    "anchor"=>"header-1-2-1-2",
                    "source_path"=>"index.html",
                    "children"=>
                      [{"label"=>"Header 1.2.1.2.1",
                        "anchor"=>"header-1-2-1-2-1",
                        "source_path"=>"index.html",
                        "children"=>[]}]},
                   {"label"=>"Header 1.2.1.3",
                    "anchor"=>"header-1-2-1-3",
                    "source_path"=>"index.html",
                    "children"=>[]}]}]},
           {"label"=>"Header 1.3",
            "anchor"=>"header-1-3",
            "source_path"=>"index.html",
            "children"=>[]}]},
       {"label"=>"Header 2",
        "anchor"=>"header-2",
        "source_path"=>"index.html",
        "children"=>[]},
       {"label"=>"Header 3",
        "anchor"=>"header-3",
        "source_path"=>"index.html",
        "children"=>[
          {"label"=>"Header 3-1",
           "anchor"=>"header-3-1",
           "source_path"=>"index.html",
           "children"=>[]}
        ]}
      ]
    }

    it "does not have an empty TOC" do
      manifest = described_class.run(context: context).result
      expect(manifest[:attributes][:toc]).to_not eq []
    end

    it "correctly generates the TOC and excludes blank entries" do
      manifest = described_class.run(context: context).result
      expect(manifest[:attributes][:toc]).to eq toc
    end

  end

  context "when HTML file" do
    context "when single HTML page" do
      let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal-single", "index.html") }

      include_examples "outcome assertions"

      it "has one text section" do
        expected = [{ "source_identifier" => "eacf331f0ffc35d4b482f1d15a887d3b", "name" => "title", "kind" => "section", "position" => 1, "build" => "build/index.html" }]
        expect(manifest[:relationships][:text_sections]).to eq expected
      end

      it "has one ingestion source" do
        expect(manifest[:relationships][:ingestion_sources].length).to eq 1
      end
    end

    context "when HTML page with external stylesheet" do
      context "when ZIP" do
        let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal.zip") }

        include_examples "outcome assertions"

        it "has one text section" do
          expected = [{ "source_identifier" => "eacf331f0ffc35d4b482f1d15a887d3b", "name" => "title", "kind" => "section", "position" => 1, "build" => "build/index.html" }]
          expect(manifest[:relationships][:text_sections]).to eq expected
        end

        it "has one ingestion source for every unique source file" do
          expect(manifest[:relationships][:ingestion_sources].length).to eq 2
        end
      end

      context "when dir" do
        let(:path) { Rails.root.join("spec", "data", "ingestion", "html", "minimal.zip") }

        include_examples "outcome assertions"

        it "has one text section" do
          expected = [{ "source_identifier" => "eacf331f0ffc35d4b482f1d15a887d3b", "name" => "title", "kind" => "section", "position" => 1, "build" => "build/index.html" }]
          expect(manifest[:relationships][:text_sections]).to eq expected
        end

        it "has one ingestion source for every unique source file" do
          expect(manifest[:relationships][:ingestion_sources].length).to eq 2
        end
      end
    end
  end

  context "when markdown file" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "markdown", "minimal-single", "minimal-single.md") }

    include_examples "outcome assertions"

    it "has one text section" do
      expected = [{ "source_identifier" => "eacf331f0ffc35d4b482f1d15a887d3b", "name" => "title", "kind" => "section", "position" => 1, "build" => "build/index.html" }]
      expect(manifest[:relationships][:text_sections]).to eq expected
    end

    it "has one ingestion source for every unique source file" do
      expect(manifest[:relationships][:ingestion_sources].length).to eq 1
    end
  end

  context "when latex" do

    let(:path) { Rails.root.join("spec", "data", "ingestion", "latex", "example.tex") }

    it "has one text section" do
      expected = [{ "source_identifier" => "eacf331f0ffc35d4b482f1d15a887d3b", "name" => "Pandoc User’s Guide", "kind" => "section", "position" => 1, "build" => "build/index.html" }]
      expect(manifest[:relationships][:text_sections]).to eq expected
    end

    it "has one ingestion source for every unique source file" do
      expect(manifest[:relationships][:ingestion_sources].length).to eq 1
    end

  end

  context "when google doc", slow: true do

    let(:url) { "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing" }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, external_source_url: url }

    before(:all) do
      Settings.instance.update_from_environment!
      WebMock.allow_net_connect!
    end

    after(:all) do
      WebMock.disable_net_connect!
    end

    it "has one main title" do
      expected = [{ "value" => "Google Doc Prime", "position" => 1, "kind" => TextTitle::KIND_MAIN }]
      expect(manifest[:relationships][:text_titles]).to eq expected
    end

    it "has one text section" do
      expected = [{"source_identifier"=>"eacf331f0ffc35d4b482f1d15a887d3b", "name"=>"Google Doc Prime", "kind"=>"section", "position"=>1, "build"=>"build/index.html"}]
      expect(manifest[:relationships][:text_sections]).to eq expected
    end

    it "has one ingestion source" do
      expect(manifest[:relationships][:ingestion_sources].length).to eq 1
    end

  end

  context "when microsoft word" do

    let(:path) { Rails.root.join("spec", "data", "ingestion", "ms_word", "example.docx") }

    it "correctly sets the text title based on styled title text", odd_fs: true do
      expect(manifest["relationships"]["text_titles"][0]["value"]).to eq "Text Styled as Title"
    end

    it "correctly sets the text section based on styled title text", odd_fs: true do
      expect(manifest["relationships"]["text_sections"][0]["name"]).to eq "Text Styled as Title"
    end


    it "has an ingestion source for document and each media item", odd_fs: true do
      expect(manifest[:relationships][:ingestion_sources].length).to eq 2
    end

  end

end
