require "rails_helper"

RSpec.describe Ingestions::Strategy::Document::TOC do
  context "when headers are sequentially ordered" do
    let(:toc) do
      <<~HEREDOC
        <html>
          <body>
            <h1>A</h1>
            <h2>A/1</h2>
            <h3>A/1/a</h3>
            <h4>A/1/a/i</h4>
            <h2>A/2</h2>
            <h3>A/2/a</h3>
          </body>
        </html>
      HEREDOC
    end

    let(:inspector) do
      mock_inspector = double(context: {}, index_parsed_uncached: Nokogiri::HTML(toc), index_source_path: nil)
      described_class.new mock_inspector
    end

    it "correctly generates a toc structure" do
      expected =  [{:label=>"A", :anchor=>nil, :source_path=>nil, :children=>[
                      {:label=>"A/1", :anchor=>nil, :source_path=>nil, :children=>[
                        {:label=>"A/1/a",:anchor=>nil,:source_path=>nil, :children=>[
                          {:label=>"A/1/a/i",:anchor=>nil,:source_path=>nil, :children=>[]}
                        ]}
                      ]},
                      {:label=>"A/2",:anchor=>nil,:source_path=>nil, :children=>[
                        {:label=>"A/2/a", :anchor=>nil, :source_path=>nil, :children=>[]}
                      ]}
                    ]}
                   ]
      expect(inspector.toc).to eq expected
    end
  end

  context "when headers are not sequentially ordered" do
    let(:toc) do
      <<~HEREDOC
        <html>
          <body>
            <h2>A</h2>
            <h1>B</h1>
            <h3>B/1</h3>
            <h4>B/1/a</h4>
            <h4>B/1/b</h4>
            <h3>B/1/c</h3>
            <h1>C</h1>
            <h2>C/1</h2>
            <h3>C/1/a</h3>
          </body>
        </html>
      HEREDOC
    end

    let(:inspector) do
      mock_inspector = double(context: {}, index_parsed_uncached: Nokogiri::HTML(toc), index_source_path: nil)
      described_class.new mock_inspector
    end

    it "correctly generates a toc structure" do
      expected = [{:label=>"A", :anchor=>nil, :source_path=>nil, :children=>[]},
                  {:label=>"B", :anchor=>nil, :source_path=>nil, :children=>[
                    {:label=>"B/1", :anchor=>nil, :source_path=>nil, :children=>[
                      {:label=>"B/1/a",:anchor=>nil,:source_path=>nil, :children=>[]},
                      {:label=>"B/1/b", :anchor=>nil, :source_path=>nil, :children=>[]},
                      {:label=>"B/1/c",:anchor=>nil,:source_path=>nil, :children=>[]}

                    ]},
                  ]},
                  {:label=>"C", :anchor=>nil, :source_path=>nil, :children=>[
                    {:label=>"C/1",:anchor=>nil,:source_path=>nil, :children=>[
                      :label=>"C/1/a",:anchor=>nil,:source_path=>nil, :children=>[]
                    ]}
                  ]}]
      actual = inspector.toc
      expect(actual).to eq expected
    end
  end
end
