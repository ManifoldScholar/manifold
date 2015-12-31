require "rails_helper"

RSpec.describe Ingestor::Strategy::EPUB::Inspector::TOC do

  EpubInspector = Ingestor::Strategy::EPUB::Inspector::EPUB
  TocInspector = Ingestor::Strategy::EPUB::Inspector::TOC

  context "with an EPUB2" do

    let(:version) { '2.0' }
    let(:opf_content) do
      xml = '
      <package version="2.0" unique-identifier="uid" xmlns="http://www.idpf.org/2007/opf">
        <guide>
          <reference type="copyright-page" title="Copyright" href="ump-feeley1-0004.xhtml#cip"/>
          <reference type="text" title="Title Page" href="ump-feeley1-0003.xhtml#bk"/>
        </guide>
      </package>
      '
      Nokogiri::XML(xml)
    end
    let(:ncx_content) do
      '<?xml version="1.0" encoding="UTF-8"?>
        <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="en-US">
          <navMap>
            <navPoint id="cvi" playOrder="1">
              <navLabel>
                <text>Cover</text>
              </navLabel>
              <content src="ump-feeley1-0001.xhtml#cvi"/>
            </navPoint>
            <navPoint id="cip" playOrder="3">
              <navLabel>
                <text>Copyright Page</text>
              </navLabel>
              <content src="ump-feeley1-0004.xhtml#cip"/>
            </navPoint>
          </navMap>
          <pageList>
            <pageTarget id="page3" type="normal" value="3" playOrder="59">
              <navLabel>
                <text>3</text>
              </navLabel>
              <content src="intro.xhtml#page3"/>
            </pageTarget>
            <pageTarget id="page4" type="normal" value="4" playOrder="60">
              <navLabel>
                <text>4</text>
              </navLabel>
              <content src="intro.xhtml#page4"/>
            </pageTarget>
          </pageList>
        </ncx>
      '
    end

    let(:logger) { Logger.new("/dev/null") }
    let(:path) { "some/dumb/path" }
    let(:epub_inspector) do
      inspector = EpubInspector.new(path, logger)
      allow(inspector).to receive(:v2?).and_return(true)
      allow(inspector).to receive(:nav_xml_with_ns).and_return(Nokogiri::XML(ncx_content))
      allow(inspector).to receive(:nav_path).and_return('some/path')
      inspector
    end
    let(:toc_inspector) do
      toc_inspector = TocInspector.new(epub_inspector)
      allow(toc_inspector).to receive(:guide_node_references).and_return(opf_content.xpath("//xmlns:reference"))
      toc_inspector
    end
    let(:text_structure) do
      toc_inspector.text_structure
    end
    let(:toc_structure) do
      text_structure[:toc]
    end
    let(:page_list_structure) do
      text_structure[:page_list]
    end
    let(:landmarks_structure) do
      text_structure[:landmarks]
    end

    it "returns an object" do
      expect(text_structure).to_not be_nil
    end

    it "returns the correct number of text structure items" do
      expect(text_structure.length).to eq(4)
    end

    it "parses the correct number of TOC items" do
      expect(toc_structure.length).to eq(2)
    end

    it "creates a TOC structure item with the correct values" do
      last_toc_item = toc_structure.last
      expect(last_toc_item).to eq({
                                    label: "Copyright Page",
                                    anchor: "cip",
                                    source_path: "some/ump-feeley1-0004.xhtml"
                                  })
    end

    it "parses the correct number of page list items" do
      expect(page_list_structure.length).to eq(2)
    end

    it "creates a page list structure item with the correct values" do
      last_page_list_item = page_list_structure.last
      expect(last_page_list_item).to eq({
                                          label: "4",
                                          anchor: "page4",
                                          source_path: "some/intro.xhtml"
                                        })
    end

    it "parses the correct number of guide items" do
      expect(landmarks_structure.length).to eq(2)
    end

    it "creates a guide structure item with the correct values" do
      last_landmarks_item = landmarks_structure.last
      expect(last_landmarks_item).to eq({
                                          label: "Title Page",
                                          anchor: "bk",
                                          source_path: "some/ump-feeley1-0003.xhtml"
                                        })
    end
  end
end

