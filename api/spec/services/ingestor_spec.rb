require "rails_helper"

RSpec.describe Ingestor do

  let(:creator) { FactoryGirl.create(:user) }

  it "should allow assignment of a logger object" do
    logger = Logger.new(STDOUT)
    Ingestor.logger = logger
    expect(Ingestor.logger).to be logger
  end

  it "should reset the logger back to Rails.logger" do
    logger = Logger.new(STDOUT)
    Ingestor.logger = logger
    expect(Ingestor.logger).to be logger
    Ingestor.reset_logger
    expect(Ingestor.logger).to be Rails.logger
  end

  describe "When determining the ingestion strategy", :integration do

    sources = [
      [
        "an html directory",
        Rails.root.join("spec", "data", "ingestion", "html", "minimal" ),
        "Ingestor::Strategy::Html::Strategy"
      ],
      [
        "a zipped html directory",
        Rails.root.join("spec", "data", "ingestion", "html", "minimal.zip" ),
        "Ingestor::Strategy::Html::Strategy"
      ],
      [
        "a markdown directory",
        Rails.root.join("spec", "data", "ingestion", "markdown", "minimal" ),
        "Ingestor::Strategy::Markdown::Strategy"
      ],
      [
        "a zipped markdown directory",
        Rails.root.join("spec", "data", "ingestion", "markdown", "minimal.zip" ),
        "Ingestor::Strategy::Markdown::Strategy"
      ],
      [
        "a google doc",
        "https://docs.google.com/document/d/1G053ixdCuaNI_2JyrtBm0-ph_0RDAtPtUxDDCmfFeX4/edit?usp=sharing",
        "Ingestor::Strategy::GoogleDoc::Strategy"
      ],
      [
        "an EPUB2 directory",
        Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v2" ),
        "Ingestor::Strategy::EPUB::Strategy"
      ],
      [
        "a zipped EPUB2 directory",
        Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v2.zip" ),
        "Ingestor::Strategy::EPUB::Strategy"
      ],
      [
        "an EPUB3 directory",
        Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3" ),
        "Ingestor::Strategy::EPUB::Strategy"
      ],
      [
        "a zipped EPUB3 directory",
        Rails.root.join("spec", "data", "ingestion", "epubs", "minimal-v3.zip" ),
        "Ingestor::Strategy::EPUB::Strategy"
      ]
    ]

    sources.each do |source|
      name, path, strategy = source
      it "Sets the strategy to #{strategy} for #{name} source" do
        expect(Ingestor.determine_strategy(path, creator)).to eq strategy
      end
    end

  end

end
