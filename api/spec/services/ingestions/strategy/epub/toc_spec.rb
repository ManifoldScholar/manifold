require "rails_helper"

RSpec.describe Ingestions::Strategy::Epub::TOC do

  context "when v3" do
    let(:toc) do
      <<~HEREDOC
        <?xml version="1.0" encoding="UTF-8"?>
        <!DOCTYPE html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops">
          <nav epub:type="toc">
            <h1>Table of Contents</h1>
            <ol>
              <li>
                <span>Section 1</span>
                <ol>
                  <li>
                    <span>Section 2</span>
                    <ol>
                      <li>
                        <span>Section 2.a</span>
                      </li>
                    </ol>
                  </li>
                </ol>
              </li>
              <li><span>Section 3</span></li>
            </ol>
          </nav>
        </html>
      HEREDOC
    end

    let(:inspector) do
      mock_inspector = double(v2?: false, context: {}, nav_parsed: Nokogiri::XML(toc), nav_path: nil)
      described_class.new mock_inspector
    end

    it "correctly generates a toc structure" do
      expected =  [{:label=>"Section 1", :anchor=>"", :source_path=>"", :type=>nil, :children=>
                    [{:label=>"Section 2", :anchor=>"", :source_path=>"", :type=>nil, :children=>
                      [{:label=>"Section 2.a", :anchor=>"", :source_path=>"", :type=>nil}]
                     }]},
                   {:label=>"Section 3", :anchor=>"", :source_path=>"", :type=>nil}]
      expect(inspector.toc_structure).to eq expected
    end
  end

  context "when v2" do
    let(:toc) do
      <<~HEREDOC
      <?xml version="1.0" encoding="UTF-8"?>
      <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
        <navMap>
          <navPoint id="navPoint-1">
            <navLabel>
              <text>Section 1</text>
            </navLabel>
            <content src=nil />
            <navPoint id="navPoint-2">
              <navLabel>
                <text>Section 2</text>
              </navLabel>
              <content src=nil />
              <navPoint id="navPoint-2a">
                <navLabel>
                  <text>Section 2.a</text>
                </navLabel>
                <content src=nil />
              </navPoint>
            </navPoint>
          </navPoint>
          <navPoint id="navPoint-3">
            <navLabel>
              <text>Section 3</text>
            </navLabel>
            <content src=nil />
          </navPoint>
        </navMap>
      </ncx>
      HEREDOC
    end

    let(:inspector) do
      mock_inspector = double(v2?: true, context: {}, nav_parsed: Nokogiri::XML(toc), nav_path: nil)
      described_class.new mock_inspector
    end

    it "correctly generates a toc structure" do
      expected =  [{:label=>"Section 1", :anchor=>"", :source_path=>"", :type=>nil, :children=>
                    [{:label=>"Section 2", :anchor=>"", :source_path=>"", :type=>nil, :children=>
                       [{:label=>"Section 2.a", :anchor=>"", :source_path=>"", :type=>nil}]
                     }]},
                   {:label=>"Section 3", :anchor=>"", :source_path=>"", :type=>nil}]
      expect(inspector.toc_structure).to eq expected
    end
  end

end
