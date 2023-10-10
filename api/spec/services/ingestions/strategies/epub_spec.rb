require "rails_helper"

RSpec.describe Ingestions::Strategies::Epub do
  include TestHelpers::IngestionHelper

  let(:path) { nil }
  let(:ingestion) { FactoryBot.create :ingestion, :uningested, :file_source, source_path: path }
  let(:context) { create_context(ingestion) }
  let!(:manifest) { described_class.run(context: context).result }

  shared_examples "outcome assertions" do
    it "sets the ingestion type to epub" do
      expect(context.ingestion.ingestion_type).to eq "epub"
    end

    describe "the returned manifest" do
      describe "its text attributes" do
        it "has the correct language" do
          expect(manifest[:attributes][:metadata][:language]).to eq "en"
        end

        it "has the correct rights" do
          expect(manifest[:attributes][:metadata][:rights]).to eq "Your rights here"
        end

        it "has the correct description" do
          expect(manifest[:attributes][:description]).to eq "Your description here"
        end

        it "has the correct date" do
          expect(manifest[:attributes][:publication_date]).to eq "2020-12-30"
        end

        it "has the correct page list" do
          expect(manifest[:attributes][:page_list]).to eq []
        end
      end
    end

    describe "its relationships" do
      it "has the correct title attributes" do
        expected = [{ "value" => "Your title here", "position" => nil, "kind" => nil }]
        expect(manifest[:relationships][:text_titles]).to eq expected
      end

      it "has one creator for every unique creator name" do
        expected = [
          { "name" => "Andrew Culp" }
        ]
        expect(manifest[:relationships][:creators]).to eq expected
      end

      it "has one ingestion source for every unique source file" do
        expect(manifest[:relationships][:ingestion_sources].length).to eq 7
      end
    end
  end

  context "when V3" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip") }

    include_examples "outcome assertions"

    it "has the correct unique identifier" do
      expect(manifest[:attributes][:metadata][:unique_identifier]).to eq "test-v3"
    end

    it "has the correct TOC" do
      expected = [
        { "label" => "Section 1", "anchor" => nil, "source_path" => "EPUB/xhtml/section0001.xhtml", "type" => nil },
        { "label" => "Section 2", "anchor" => nil, "source_path" => "EPUB/xhtml/section0002.xhtml", "type" => nil, "children" => [
          { "label" => "Section 2.a", "anchor" => nil, "source_path" => "EPUB/xhtml/section0002a.xhtml", "type" => nil }
        ] },
        { "label" => "Section 2#1", "anchor" => "1", "source_path" => "EPUB/xhtml/section0002.xhtml", "type" => nil },
        { "label" => "Section 3", "anchor" => nil, "source_path" => "EPUB/xhtml/an item with spaces.xhtml", "type" => nil }
      ]
      expect(manifest[:attributes][:toc]).to eq expected
    end

    it "has one text section for every unique ingestion source referenced in TOC" do
      expected = [
        { "source_identifier" => "section0001.xhtml", "name" => "Section 1", "kind" => "navigation", "position" => 1, "build" => "build/section0001.xhtml" },
        { "source_identifier" => "section0002.xhtml", "name" => "Section 2", "kind" => "section", "position" => 2, "build" => "build/section0002.xhtml" },
        { "source_identifier" => "section0002a.xhtml", "name" => "Section 2.a", "kind" => "section", "position" => 3, "build" => "build/section0002a.xhtml" },
        { "source_identifier" => "section0003.xhtml", "name" => "Section 3", "kind" => "section", "position" => 4, "build" => "build/section0003.xhtml" }
      ]
      expect(manifest[:relationships][:text_sections]).to eq expected
    end

    it "has the correct landmarks" do
      expect(manifest[:attributes][:landmarks]).to eq [{ "label" => "Table of Contents", "anchor" => nil, "source_path" => "EPUB/xhtml/section0001.xhtml", "type" => "toc" },
                                                       { "label" => "Title page", "anchor" => nil, "source_path" => "EPUB/xhtml/section0002.xhtml", "type" => "bodymatter" }]
    end
  end

  context "when V2" do
    let(:path) { Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v2.zip") }

    include_examples "outcome assertions"

    it "has the correct unique identifier" do
      expect(manifest[:attributes][:metadata][:unique_identifier]).to eq "test-v2"
    end

    it "has the correct TOC" do
      expected = [
        { "label" => "Section 1", "anchor" => nil, "source_path" => "OEBPS/xhtml/section0001.xhtml", "type" => nil },
        { "label" => "Section 2", "anchor" => nil, "source_path" => "OEBPS/xhtml/section0002.xhtml", "type" => nil, "children" => [
          { "label" => "Section 2.a", "anchor" => nil, "source_path" => "OEBPS/xhtml/section0002a.xhtml", "type" => nil }
        ] },
        { "label" => "Section 3", "anchor" => nil, "source_path" => "OEBPS/xhtml/section0003.xhtml", "type" => nil }
      ]
      expect(manifest[:attributes][:toc]).to eq expected
    end

    it "has one text section for every unique ingestion source referenced in TOC" do
      expected = [
        { "source_identifier" => "section0001.xhtml",  "name" => "Section 1", "kind" => "navigation", "position" => 1, "build" => "build/section0001.xhtml" },
        { "source_identifier" => "section0002.xhtml",  "name" => "Section 2", "kind" => "section", "position" => 2, "build" => "build/section0002.xhtml" },
        { "source_identifier" => "section0002a.xhtml", "name" => "Section 2.a", "kind" => "section", "position" => 3, "build" => "build/section0002a.xhtml" },
        { "source_identifier" => "section0003.xhtml", "name" => "Section 3", "kind" => "section", "position" => 4, "build" => "build/section0003.xhtml" }
      ]
      expect(manifest[:relationships][:text_sections]).to eq expected
    end

    it "has the correct landmarks" do
      expect(manifest[:attributes][:landmarks]).to eq [{ "label" => "Table of Contents", "anchor" => nil, "source_path" => "OEBPS/xhtml/section0001.xhtml", "type" => "toc" },
                                                       { "label" => "Start", "anchor" => nil, "source_path" => "OEBPS/xhtml/section0002.xhtml", "type" => "text" }]
    end
  end

  context "when url", slow: true do

    let(:url) { "https://storage.googleapis.com/manifold-assets/spec/e-t-a-hoffmann_master-flea.epub3" }
    let!(:ingestion) { FactoryBot.create :ingestion, :uningested, external_source_url: url }

    before(:all) do
      Settings.instance.update_from_environment!
      WebMock.allow_net_connect!
    end

    after(:all) do
      WebMock.disable_net_connect!
    end

    describe "the returned manifest" do
      describe "its text attributes" do
        it "has the correct language" do
          expect(manifest[:attributes][:metadata][:language]).to eq "en-GB"
        end

        it "has the correct rights" do
          expected = "The source text and artwork in this ebook edition are believed to be in the U.S. public domain. This ebook edition is released under the terms in the CC0 1.0 Universal Public Domain Dedication, available at https://creativecommons.org/publicdomain/zero/1.0/. For full license information see the Uncopyright file included at the end of this ebook."
          expect(manifest[:attributes][:metadata][:rights]).to eq expected
        end

        it "has the correct description" do
          expected = "A gentleman bachelor gains an epic advantage of tiny proportions in this allegorical, Romantic, fairy-tale novel."
          expect(manifest[:attributes][:description]).to eq expected
        end

        it "has the correct date" do
          expect(manifest[:attributes][:publication_date]).to eq "2017-07-24T20:46:32Z"
        end

        it "has the correct landmarks" do
          expected = [
            { "label" => "Titlepage", "anchor" => nil, "source_path" => "epub/text/titlepage.xhtml", "type" => "frontmatter titlepage" },
            { "label" => "Imprint", "anchor" => nil, "source_path" => "epub/text/imprint.xhtml", "type" => "frontmatter imprint" },
            { "label" => "Master Flea", "anchor" => nil, "source_path" => "epub/text/chapter-1.xhtml", "type" => "bodymatter z3998:fiction" },
            { "label" => "Endnotes", "anchor" => nil, "source_path" => "epub/text/endnotes.xhtml", "type" => "backmatter rearnotes" },
            { "label" => "Colophon", "anchor" => nil, "source_path" => "epub/text/colophon.xhtml", "type" => "backmatter colophon" },
            { "label" => "Uncopyright", "anchor" => nil, "source_path" => "epub/text/uncopyright.xhtml", "type" => "backmatter copyright-page" }
          ]
          expect(manifest[:attributes][:landmarks]).to eq expected
        end

        it "has the correct page list" do
          expect(manifest[:attributes][:page_list]).to eq []
        end
      end
    end

    describe "its relationships" do
      it "has the correct titles" do
        expected = [{ "value" => "Master Flea", "position" => nil, "kind" => nil }]
        expect(manifest[:relationships][:text_titles]).to eq expected
      end

      it "has one creator for every unique creator name" do
        expected = [
          { "name" => "E. T. A. Hoffmann" }
        ]
        expect(manifest[:relationships][:creators]).to eq expected
      end

      it "has one contributor for every unique contributor name" do
        expected = [
          { "name" => "The League of Moveable Type" },
          { "name" => "George Soane" },
          { "name" => "Jan Verkolje" },
          { "name" => "Charles Bowen" },
          { "name" => "Jared Updike" },
          { "name" => "Alex Cabal" }
        ]
        expect(manifest[:relationships][:contributors]).to eq expected
      end

      it "has one text section for every unique ingestion source referenced in TOC" do
        expected = [
          { "source_identifier" => "titlepage.xhtml", "name" => "Titlepage", "kind" => "section", "position" => 1, "build" => "build/titlepage.xhtml" },
          { "source_identifier" => "imprint.xhtml", "name" => "Imprint", "kind" => "section", "position" => 2, "build" => "build/imprint.xhtml" },
          { "source_identifier" => "chapter-1.xhtml",  "name" => "I First Adventure", "kind" => "section", "position" => 3, "build" => "build/chapter-1.xhtml" },
          { "source_identifier" => "chapter-2.xhtml",  "name" => "II Second Adventure", "kind" => "section", "position" => 4, "build" => "build/chapter-2.xhtml"  },
          { "source_identifier" => "chapter-3.xhtml",  "name" => "III Third Adventure", "kind" => "section", "position" => 5, "build" => "build/chapter-3.xhtml"  },
          { "source_identifier" => "chapter-4.xhtml",  "name" => "IV Fourth Adventure", "kind" => "section", "position" => 6, "build" => "build/chapter-4.xhtml"  },
          { "source_identifier" => "chapter-5.xhtml",  "name" => "V Fifth Adventure", "kind" => "section", "position" => 7, "build" => "build/chapter-5.xhtml"  },
          { "source_identifier" => "chapter-6.xhtml",  "name" => "VI Sixth Adventure", "kind" => "section", "position" => 8, "build" => "build/chapter-6.xhtml" },
          { "source_identifier" => "chapter-7.xhtml",  "name" => "VII Seventh Adventure", "kind" => "section", "position" => 9, "build" => "build/chapter-7.xhtml" },
          { "source_identifier" => "endnotes.xhtml",  "name" => "Endnotes", "kind" => "section", "position" => 10, "build" => "build/endnotes.xhtml" },
          { "source_identifier" => "colophon.xhtml",  "name" => "Colophon", "kind" => "section", "position" => 11, "build" => "build/colophon.xhtml" },
          { "source_identifier" => "uncopyright.xhtml", "name" => "Uncopyright", "kind" => "section", "position" => 12, "build" => "build/uncopyright.xhtml" }
        ]

        expect(manifest[:relationships][:text_sections]).to eq expected
      end

      it "has one ingestion source for every unique source file" do
        expect(manifest[:relationships][:ingestion_sources].length).to eq 18
      end
    end
  end
end
