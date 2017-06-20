require "rails_helper"

# rubocop:disable Metrics/LineLength
RSpec.describe Ingestor::Strategy::Html::Inspector::Html do

  let(:document_contents) {
    <<~HEREDOC
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
            <title>A Third University Is Possible</title>
            <meta charset="UTF-8"/>
        
            <link rel="stylesheet" type="text/css" href="stylesheet_1.css"/>
            <style type="text/css">
                .some-class {
                    font-weight: bold;
                }
            </style>

            <style type="text/css">
                .some-other-class {
                    font-weight: bold;
                }
            </style>
            <link rel="stylesheet" type="text/css" href="stylesheet_2.css"/>
        </head>
        <body>
            <p>Some text</p>
        </body>
      </html>
    HEREDOC
  }

  let(:stylesheet_1_contents) {
    <<~HEREDOC
      p {
          font-weight: bold;
      }
      
      .paragraph {
          font-weight: bold;
      }
    HEREDOC
  }

  let(:stylesheet_2_contents) {
    <<~HEREDOC
      span {
          font-weight: bold;
      }
      
      .some-span {
          font-weight: bold;
      }
    HEREDOC
  }


  let(:inspector) {
    path = '/path/to/ingestion'
    ingestion = Ingestor::Ingestion.new(path, FactoryGirl.create(:user), NullLogger.new )
    inspector = Ingestor::Strategy::Html::Inspector::Html.new(ingestion)
    allow(inspector).to receive(:index_path).and_return("index.html")
    allow(inspector).to receive(:index_parsed).and_return(Nokogiri::HTML(document_contents, nil, "utf-8"))
    allow(ingestion).to receive(:read).with("stylesheet_1.css").and_return(stylesheet_1_contents)
    allow(ingestion).to receive(:read).with("stylesheet_2.css").and_return(stylesheet_2_contents)
    return inspector
  }

  let(:first_style_tag_contents) {
    <<-HEREDOC
          .some-class {
              font-weight: bold;
          }
    HEREDOC
  }

  let(:second_style_tag_contents) {
    <<-HEREDOC
          .some-other-class {
              font-weight: bold;
          }
    HEREDOC
  }

  let(:ss_inspectors) {
    inspector.stylesheet_inspectors
  }

  it "returns a stylesheet inspector for each style block and each stylesheet" do
    expect(ss_inspectors.length).to be 4
  end

  describe "its stylesheet inspectors" do

    it "the first one has the correct styles" do
      expect(ss_inspectors[0].raw_styles).to eq_ignoring_whitespace stylesheet_1_contents
    end

    it "the second one has the correct styles" do
      expect(ss_inspectors[1].raw_styles).to eq_ignoring_whitespace first_style_tag_contents
    end

    it "the third one has the correct styles" do
      expect(ss_inspectors[2].raw_styles).to eq_ignoring_whitespace second_style_tag_contents
    end

    it "the fourth one has the correct styles" do
      expect(ss_inspectors[3].raw_styles).to eq_ignoring_whitespace stylesheet_2_contents
    end

  end

end
