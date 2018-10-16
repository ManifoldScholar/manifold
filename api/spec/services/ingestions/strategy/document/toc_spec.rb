require "rails_helper"

RSpec.describe Ingestions::Strategy::Document::TOC do
  context "when headers are sequentially ordered" do
    let(:toc) do
      <<~HEREDOC
        <html>
          <body>
            <h1>The first header</h1>
            <h2>The second header</h2>
            <h3>The third header</h3>
            <h4>The fourth header</h4>
            <h2>The fifth header</h2>
            <h3>The sixth header</h3>
          </body>
        </html>
      HEREDOC
    end

    let(:inspector) do
      mock_inspector = double(context: {}, index_parsed_uncached: Nokogiri::HTML(toc), index_source_path: nil)
      described_class.new mock_inspector
    end

    it "correctly generates a toc structure" do
      expected =  [{:label=>"The first header", :anchor=>nil, :source_path=>nil, :children=>[
                      {:label=>"The second header", :anchor=>nil, :source_path=>nil, :children=>[
                        {:label=>"The third header",:anchor=>nil,:source_path=>nil, :children=>[
                          {:label=>"The fourth header",:anchor=>nil,:source_path=>nil, :children=>[]}
                        ]}
                      ]},
                      {:label=>"The fifth header",:anchor=>nil,:source_path=>nil, :children=>[
                        {:label=>"The sixth header", :anchor=>nil, :source_path=>nil, :children=>[]}
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
            <h2>The first header</h2>
            <h1>The second header</h1>
            <h3>The third header</h3>
            <h4>The fourth header</h4>
            <h4>The fifth header</h4>
            <h3>The sixth header</h3>
            <h1>The seventh header</h1>
            <h2>The eighth header</h2>
            <h3>The ninth header</h3>
          </body>
        </html>
      HEREDOC
    end

    let(:inspector) do
      mock_inspector = double(context: {}, index_parsed_uncached: Nokogiri::HTML(toc), index_source_path: nil)
      described_class.new mock_inspector
    end

    it "correctly generates a toc structure" do
      expected = [{:label=>"The first header", :anchor=>nil, :source_path=>nil, :children=>[]},
                  {:label=>"The second header", :anchor=>nil, :source_path=>nil, :children=>[
                    {:label=>"The third header", :anchor=>nil, :source_path=>nil, :children=>[
                      {:label=>"The fourth header",:anchor=>nil,:source_path=>nil, :children=>[]},
                      {:label=>"The fifth header", :anchor=>nil, :source_path=>nil, :children=>[]}
                    ]},
                    {:label=>"The sixth header",:anchor=>nil,:source_path=>nil, :children=>[]}
                  ]},
                  {:label=>"The seventh header", :anchor=>nil, :source_path=>nil, :children=>[
                    {:label=>"The eighth header",:anchor=>nil,:source_path=>nil, :children=>[
                      :label=>"The ninth header",:anchor=>nil,:source_path=>nil, :children=>[]
                    ]}
                  ]}]
      expect(inspector.toc).to eq expected
    end
  end
end
